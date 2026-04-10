import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';


// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TM_VARIETY_SETTING_';
export const GET_VENDOR_INFO = `${PRE_FIX}GET_VENDOR_INFO`;
export const GET_SERVER_INFO = `${PRE_FIX}GET_SERVER_INFO`;
export const SAVE_SERVER_INFO = `${PRE_FIX}SAVE_SERVER_INFO`;


// ---------------------------------------------
// action creaters
// ---------------------------------------------


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

export const saveServerInfo = createAction(
  SAVE_SERVER_INFO,
  (data, serverId) => post({
    url: `/v2/os/products/symbol/${serverId}`,
    data: data
  })
);