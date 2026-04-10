import { handleActions } from "redux-actions";
import {
  ORDER_TYPE,
  ORDER_STATUS,
  PERIOD_TYPE,
  RECHARGE_TYPE,
  RECHARGE_TYPE_RECHARGE_STATUS,
  RECHARGE_TYPE_REMITTING_STATUS
} from "../constant";
import { dateRange } from "utils/config";

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_ORDER_LIST,
  GET_ORDER_DETAIL,
  GET_RECHARGE_RECORD,
  GET_VALUE_ADDED_SERVICE,
  CHANGE_VALUE_ADDED_SERVICE_DATE_RANGE,
  GET_LIVE_SERVICE,
  GET_DEMAND_SERVICE
} from "./actions";

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const orderType = handleActions({}, ORDER_TYPE);

export const orderStatus = handleActions({}, ORDER_STATUS);

export const periodType = handleActions({}, PERIOD_TYPE);

export const rechargeType = handleActions({}, RECHARGE_TYPE);

export const rechargeTypeRechargeStatus = handleActions(
  {},
  RECHARGE_TYPE_RECHARGE_STATUS
);

export const rechargeTypeRemittingStatus = handleActions(
  {},
  RECHARGE_TYPE_REMITTING_STATUS
);

export const orderList = handleActions(
  {
    [GET_ORDER_LIST]: (state, { payload }) => payload
  },
  { list: [] }
);

export const orderDetail = handleActions(
  {
    [GET_ORDER_DETAIL]: (state, { payload }) => payload
  },
  {}
);

export const rechargeRecord = handleActions(
  {
    [GET_RECHARGE_RECORD]: (state, { payload }) => payload
  },
  { list: [] }
);

export const valueAddedService = handleActions(
  {
    [GET_VALUE_ADDED_SERVICE]: (state, { payload }) => payload
  },
  {}
);

export const valueAddedServiceDateRange = handleActions(
  {
    [CHANGE_VALUE_ADDED_SERVICE_DATE_RANGE]: (state, { payload }) => payload
  },
  dateRange.all
);

export const liveService = handleActions(
  {
    [GET_LIVE_SERVICE]: (state, { payload }) => payload
  },
  {
    list: [],
    totalUsed: 0
  }
);

export const demandService = handleActions(
  {
    [GET_DEMAND_SERVICE]: (state, { payload }) => payload
  },
  {
    list: [],
    totalUsed: 0
  }
);
