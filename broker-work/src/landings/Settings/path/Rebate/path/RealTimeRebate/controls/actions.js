import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'REAL_TIME_REBATE_';

export const GET_REAL_TIME_STATUS = `${PRE_FIX}GET_REAL_TIME_STATUS`;
export const ENABLE_REAL_TIME = `${PRE_FIX}ENABLE_REAL_TIME`;
export const DISABLE_REAL_TIME = `${PRE_FIX}DISABLE_REAL_TIME`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getRealTimeStatus = createAction(GET_REAL_TIME_STATUS, type =>
  get({
    url:
      '/v1/report/setting/commission/status' +
      (type ? `?functionType=${type}` : '')
  })
);

export const enableRealTime = createAction(ENABLE_REAL_TIME, data =>
  post({
    url: '/v1/report/setting/commission/enable',
    data
  })
);

export const disableRealTime = createAction(DISABLE_REAL_TIME, data =>
  post({
    url: '/v1/report/setting/commission/disable',
    data
  })
);
