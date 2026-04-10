import { createAction } from "redux-actions";
import { get, post } from "utils/ajax";

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = "TM_VENDOR_SETTING_";
export const GET_VENDOR_INFO = `${PRE_FIX}GET_VENDOR_INFO`;
export const GET_SERVER_GROUP = `${PRE_FIX}GET_SERVER_GROUP`;
export const SET_PIPS_ORIGIN = `${PRE_FIX}SET_PIPS_ORIGIN`;
export const SET_VENDOR_ORIGIN = `${PRE_FIX}SET_VENDOR_ORIGIN`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getVendorInfo = createAction(GET_VENDOR_INFO, () =>
  get({
    url: "/v2/os/products/vendor/MT4"
  })
);

export const setVendorOrigin = createAction(SET_VENDOR_ORIGIN, serverId =>
  post({
    url: `/v2/os/products/vendor/${serverId}`
  })
);

export const getServerGroup = createAction(GET_SERVER_GROUP, serverId =>
  get({
    url: "/v2/os/products/vendor/group/list",
    data: { serverId }
  })
);

export const setPipsOrigin = createAction(
  SET_PIPS_ORIGIN,
  ({ serverId, group }) =>
    post({
      url: `/v2/os/products/vendor/group/${serverId}/${group}`
    })
);
