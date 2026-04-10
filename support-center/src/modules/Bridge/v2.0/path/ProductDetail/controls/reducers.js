import { handleActions } from "redux-actions";

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { GET_PRODUCT_INFO, GET_USAGE_INFO } from "./actions";

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const productInfo = handleActions(
  {
    [GET_PRODUCT_INFO]: (state, { payload }) => payload
  },
  {}
);

export const usageInfo = handleActions(
  {
    [GET_USAGE_INFO]: (state, { payload }) => payload
  },
  {
    // 服务器连接统计
    connectorLimit: 0,
    connectorUsed: 0,

    // 实时连接统计
    connectLimit: 0,
    connectUsed: 0,

    // 交易量统计
    tradeAmountLimit: 0,
    tradeAmountUsed: 0
  }
);
