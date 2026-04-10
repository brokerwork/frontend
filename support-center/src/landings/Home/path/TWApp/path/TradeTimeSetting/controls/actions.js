import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';


// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TW_TRADETIME_SETTING_';
export const GET_VENDOR_INFO = `${PRE_FIX}GET_VENDOR_INFO`;
export const GET_TIME_INFO = `${PRE_FIX}GET_TIME_INFO`;
export const SAVE_TIME_SYNCHRONIZE = `${PRE_FIX}SAVE_TIME_SYNCHRONIZE`;
export const SAVE_TIME_SINGLE = `${PRE_FIX}SSAVE_TIME_SINGLE`;


// ---------------------------------------------
// action creaters
// ---------------------------------------------


export const getVendorInfo = createAction(
  GET_VENDOR_INFO,
  () => get({
    url: '/v2/os/products/vendor/MT4',
    data: {
      timezone: 1
    }
  })
);

export const getTimeInfo = createAction(
  GET_TIME_INFO,
  (serverId) => get({
    url: `/v2/os/products/exchange/hour/${serverId}`
  })
);

export const saveTimeSynchronize = createAction(
  SAVE_TIME_SYNCHRONIZE,
  (serverId) => post({
    url: `/v2/os/products/exchange/hour/sync/${serverId}`
  })
);

export const saveTimeSingle = createAction(
  SAVE_TIME_SINGLE,
  (serverId, data) => post({
    url: `/v2/os/products/exchange/hour/${serverId}`,
    data: data
  })
);