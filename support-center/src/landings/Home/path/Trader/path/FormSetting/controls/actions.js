import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
const PRE_FIX = 'TRADER_FORM_';
export const GET_FIELDS = `${PRE_FIX}GET_FIELDS`;
export const CHOOSE_FIELDS = `${PRE_FIX}CHOOSE_FIELDS`;
const SAVE_FIELDS = `${PRE_FIX}SAVE_FIELDS`;
const SWITCH_FIELDS = `${PRE_FIX}SWITCH_FIELDS`;
export const SORT = `${PRE_FIX}SORT`;
export const DEL = `${PRE_FIX}DEL`;
export const GET_PLATS = `${PRE_FIX}GET_PLATS`;
export const getFieldList = createAction(GET_FIELDS, vendor =>
  get({
    url: `/v2/os/products/conf/register/open/account/form-fields/${vendor}`
  }).then(res => {
    const {
      data: { accountFields = [], poolFields = [], functionEnable }
    } = res;
    const steps = accountFields
      .map(item => ({ ...item, uuid: `${item.key}#${item.formName}` }))
      .filter(item => (!item.relation && item.relationFunc) || (!item.relation && !item.relationFunc));
    const poolList = poolFields
      .map(item => ({ ...item, name: item.label, uuid: `${item.key}#${item.formName}` }))
      .filter(item => (!item.relation && item.relationFunc) || (!item.relation && !item.relationFunc));
    return {
      data: {
        accountFields: steps,
        poolFields: poolList,
        functionEnable
      },
      result: true
    };
  })
);
export const getPlats = createAction(GET_PLATS, () =>
  get({
    url: `/v2/os/config/vendors`
  })
);
export const saveFields = createAction(SAVE_FIELDS, (accountFields, plat) => dispatch => {
  return post({
    url: `/v2/os/products/conf/register/open/account/form-fields`,
    data: {
      vendor: plat,
      accountFields
    }
  }).then(rs => {
    if (rs.result) {
      dispatch(getFieldList(plat));
    }
    return rs;
  });
});
export const chooseFields = createAction(CHOOSE_FIELDS, keys => keys);
export const sort = createAction(SORT, data => data);
export const del = createAction(DEL, index => index);
export const switchStatus = createAction(SWITCH_FIELDS, (status, plat) => dispatch => {
  return post({
    url: '/v2/os/products/conf/register/open/account/switch',
    data: {
      functionEnable: status
    }
  }).then(rs => {
    if (rs.result) {
      dispatch(getFieldList(plat));
    }
    return rs;
  });
});
