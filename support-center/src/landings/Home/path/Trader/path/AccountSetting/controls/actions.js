import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TRADER_ACCOUNT_SETTING';
export const GET_ACCOUNT_FIELDS = `${PRE_FIX}GET_ACCOUNT_FIELDS`;
export const GET_ACCOUNT_PROFILE = `${PRE_FIX}GET_ACCOUNT_PROFILE`;
export const SAVE_ACCOUNT_PROFILE = `${PRE_FIX}SAVE_ACCOUNT_PROFILE`;
export const CHANGE_FIELD = `${PRE_FIX}CHANGE_FIELD`;
export const CHANGE_FIELD_DATA = `${PRE_FIX}CHANGE_FIELD_DATA`;
export const SET_ERROR = `${PRE_FIX}SET_ERROR`;
export const CLEAR_ERROR = `${PRE_FIX}CLEAR_ERROR`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

//获取账户相关的字段列表
export const getAccountFields = createAction(GET_ACCOUNT_FIELDS, () =>
  get({
    url: '/v1/ops/product/account/properties/setting/fields'
  }).then(res => {
    if (!res.result) {
      return res;
    }
    const data = res.data && res.data.length ? res.data.map(el => ({ label: el.name, value: el.key })) : [];
    return { result: true, data };
  })
);

//获取账户资料当前配置
export const getAccountProfile = createAction(GET_ACCOUNT_PROFILE, () =>
  get({
    url: '/v1/ops/product/account/properties/setting'
  })
);

//保存账户资料当前配置
export const saveAccountProfile = createAction(SAVE_ACCOUNT_PROFILE, data =>
  post({
    url: '/v1/ops/product/account/properties/setting',
    data
  })
);

export const changeField = createAction(CHANGE_FIELD, (key, value) => ({ [key]: value }));
export const changeFieldData = createAction(CHANGE_FIELD_DATA, payload => payload);
export const setError = createAction(SET_ERROR, (key, value) => ({ [key]: value }));
export const clearError = createAction(CLEAR_ERROR, key => ({ [key]: '' }));
