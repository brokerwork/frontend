import { createAction } from "redux-actions";
import { get, post } from "utils/ajax";

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = "CONSUMPTION_";
export const GET_ORDER_LIST = `${PRE_FIX}GET_ORDER_LIST`;
export const GET_ORDER_DETAIL = `${PRE_FIX}GET_ORDER_DETAIL`;
export const GET_RECHARGE_RECORD = `${PRE_FIX}GET_RECHARGE_RECORD`;
export const CANCEL_ORDER = `${PRE_FIX}CANCEL_ORDER`;
export const PAY_ORDER = `${PRE_FIX}PAY_ORDER`;
export const GET_VALUE_ADDED_SERVICE = `${PRE_FIX}GET_VALUE_ADDED_SERVICE`;
export const CHANGE_VALUE_ADDED_SERVICE_DATE_RANGE = `${PRE_FIX}CHANGE_VALUE_ADDED_SERVICE_DATE_RANGE`;
export const GET_LIVE_SERVICE = `${PRE_FIX}GET_LIVE_SERVICE`;
export const GET_DEMAND_SERVICE = `${PRE_FIX}GET_DEMAND_SERVICE`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getOrderList = createAction(
  GET_ORDER_LIST,
  (page = 1, pageSize = 10) =>
    get({
      url: "/v2/os/tenants/order/page",
      data: {
        page,
        pageSize
      }
    })
);

export const getOrderDetail = createAction(GET_ORDER_DETAIL, orderNo =>
  get({
    url: `/v2/os/tenants/order/${orderNo}`
  })
);

export const getRechargeRecord = createAction(
  GET_RECHARGE_RECORD,
  (page = 1, pageSize = 10) =>
    get({
      url: "/v2/os/tenants/recharge/order",
      data: {
        page,
        pageSize
      }
    })
);

export const cancelOrder = createAction(CANCEL_ORDER, orderNo =>
  post({
    url: `/v2/os/tenants/recharge/cancel/${orderNo}`
  })
);

export const payOrder = createAction(PAY_ORDER, (orderNo, providerId) =>
  post({
    url: `/v2/os/tenants/recharge/pay/${orderNo}?providerId=${providerId}`
  })
);

export const getValueAddedService = createAction(
  GET_VALUE_ADDED_SERVICE,
  ({ start, end }) =>
    get({
      url: "/v2/os/tenants/vas/stat",
      data: {
        start,
        end
      }
    })
);

export const _changeValueAddedServiceDataRange = createAction(
  CHANGE_VALUE_ADDED_SERVICE_DATE_RANGE,
  range => range
);

export const getLiveService = createAction(
  GET_LIVE_SERVICE,
  ({ start, end, pager = 1, pageSize = 10 }) =>
    get({
      url: "/v2/os/products/video/stat",
      data: {
        start,
        end,
        pageSize,
        pager
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      return {
        ...res,
        data: {
          ...res.data,
          totalUsed: res.data.sta ? res.data.sta.liveTotalUsed : 0
        }
      };
    })
);

export const getDemandService = createAction(
  GET_DEMAND_SERVICE,
  ({ start, end, pager = 1, pageSize = 10 }) =>
    get({
      url: "/v2/os/products/video/stat",
      data: {
        start,
        end,
        pageSize,
        pager
      }
    }).then(res => {
      if (!res.result) return Promise.resolve(res);

      return {
        ...res,
        data: {
          ...res.data,
          totalUsed: res.data.sta ? res.data.sta.demandTotalUsed : 0
        }
      };
    })
);
