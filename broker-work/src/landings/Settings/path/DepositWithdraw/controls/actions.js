import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

const PRE_FIX = 'DEPOSIT_WITHDRAW_SETTING_';

export const GET_DEPOSIT_WITHDRAW_INFO = `${PRE_FIX}GET_DEPOSIT_WITHDRAW_INFO`;
export const CREATE_TYPE = `${PRE_FIX}CREATE_TYPE`;
export const UPDATE_TYPE = `${PRE_FIX}UPDATE_TYPE`;
export const REMOVE_TYPE = `${PRE_FIX}REMOVE_TYPE`;
export const UPDATE_SETTING = `${PRE_FIX}UPDATE_SETTING`;
export const SET_PARAMS = `${PRE_FIX}SET_PARAMS`;
export const SWITCH = `${PRE_FIX}SWITCH`;
export const GET_STAT = `${PRE_FIX}GET_STAT`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getDepositWithdrawInfo = createAction(
  GET_DEPOSIT_WITHDRAW_INFO,
  () =>
    get({
      url: '/v1/report/stat/setting/deposit/withdraw'
    })
);

export const createType = createAction(CREATE_TYPE, data =>
  post({
    url: '/v1/report/stat/setting/deposit/withdraw/add',
    data
  })
);

export const updateType = createAction(UPDATE_TYPE, data =>
  post({
    url: '/v1/report/stat/setting/deposit/withdraw/update',
    data
  })
);

export const removeType = createAction(REMOVE_TYPE, id =>
  post({
    url: `/v1/report/stat/setting/deposit/withdraw/delete?id=${id}`
  })
);

export const updateSetting = createAction(UPDATE_SETTING, ids =>
  post({
    url: `/v1/report/stat/setting/deposit/withdraw?ids=${ids}`
  })
);

export const setParams = createAction(SET_PARAMS, (params, type) => ({
  ...params,
  type
}));
export const enableStat = createAction(SWITCH, data => {
  return post({
    url: '/v1/report/stat/setting/deposit/withdraw/setReportType',
    data
  });
});
export const getStat = createAction(GET_STAT, () => {
  return get({
    url: '/v1/report/stat/setting/deposit/withdraw/getReportType'
  });
});
