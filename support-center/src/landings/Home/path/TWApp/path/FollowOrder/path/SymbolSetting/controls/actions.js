import { createAction } from "redux-actions";
import { get, post } from "utils/ajax";

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = "TWAPP_FOLLOW_ORDER_SYMBOL_";
export const GET_SERVER_SYMBOL = `${PRE_FIX}GET_SERVER_SYMBOL`;
export const UPDATE_CURRENT_SERVER_ID = `${PRE_FIX}UPDATE_CURRENT_SERVER_ID`;
export const BOUND_TENANT_SYMBOL = `${PRE_FIX}BOUND_TENANT_SYMBOL`;
export const UPDATE_SYMBOL = `${PRE_FIX}UPDATE_SYMBOL`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 获取服务器列表
export const getServerSymbol = createAction(GET_SERVER_SYMBOL, () => {
  return get({ url: "/v2/os/products/tm/follow" });
});

export const updateCurrentServerId = createAction(
  UPDATE_CURRENT_SERVER_ID,
  id => id
);

export const boundTenantSymbol = createAction(
  BOUND_TENANT_SYMBOL,
  (serverId, groupName, bossSymbolName, symbolName) =>
    post({
      url: `/v2/os/products/tm/follow/bind/${serverId}`,
      data: {
        groupName,
        bossSymbolName,
        symbolName
      }
    })
);

export const updateSymbol = createAction(UPDATE_SYMBOL, (serverId, symbol) =>
  post({
    url: `/v2/os/products/tm/follow/update/${serverId}`,
    data: symbol
  })
);
