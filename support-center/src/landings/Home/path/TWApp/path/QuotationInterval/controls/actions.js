import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';


// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TW_MOBILE_INTERVAL_SETTING';
export const GET_INTERVAL_INFO = `${PRE_FIX}GET_INTERVAL_INFO`;
export const UPDATE_INTERVAL_INFO = `${PRE_FIX}UPDATE_INTERVAL_INFO`;
export const GET_VENDOR_INFO = `${PRE_FIX}GET_VENDOR_INFO`;
export const GET_SERVER_INFO = `${PRE_FIX}GET_SERVER_INFO`;
export const UPDATE_SINGLE_INTERVAL_INFO = `${PRE_FIX}UPDATE_SINGLE_INTERVAL_INFO`;
// ---------------------------------------------
// action creaters
// ---------------------------------------------
export const getIntervalInfo = createAction(
  GET_INTERVAL_INFO,
  () => get({
    url: '/v2/os/products/symbol/quote/period/sc'
  })
);
export const getVendorInfo = createAction(
  GET_VENDOR_INFO,
  () => get({
    url: '/v2/os/products/vendor/MT4'
  })
);

export const getServerInfo = createAction(
  GET_SERVER_INFO,
  (serverId, page=1, pageSize=10) => get({
    url: `/v2/os/products/symbol/page/${serverId}`,
    data: {
      page,
      pageSize
    }
  })
);

export const updateIntervalInfo = createAction(
  UPDATE_INTERVAL_INFO,
  (data) => post({
    url: '/v2/os/products/symbol/quote/period/default',
    data: data
  })
);

export const updateSingleIntervalInfo = createAction(
  UPDATE_SINGLE_INTERVAL_INFO,
  (serverId, symbol, period) => post({
    url: `/v2/os/products/symbol/quote/period/symbol?serverId=${serverId}&symbol=${symbol}&period=${period}`,
  })
);
