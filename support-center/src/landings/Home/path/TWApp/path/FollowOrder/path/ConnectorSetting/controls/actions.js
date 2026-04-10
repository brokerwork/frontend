import { createAction } from "redux-actions";
import { get, post } from "utils/ajax";

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = "TWAPP_FOLLOW_ORDER_CONNECTOR_";
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const SWITCH_SERVER_FOLLOW = `${PRE_FIX}SWITCH_SERVER_FOLLOW`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 获取服务器列表
export const getServerList = createAction(GET_SERVER_LIST, () =>
  get({ url: "/v2/os/products/vendor/MT4" })
);

export const switchServerFollow = createAction(
  SWITCH_SERVER_FOLLOW,
  (serverId, status) =>
    post({
      url: `/v2/os/products/vendor/follow/${serverId}/${status}`
    })
);
