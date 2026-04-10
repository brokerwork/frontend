import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';


// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'TM_MONTHLY_SETTING_';
export const GET_MONTHLY_LIST = `${PRE_FIX}GET_MONTHLY_LIST`;
export const GET_MONTHLY_DETAIL = `${PRE_FIX}GET_MONTHLY_DETAIL`;
export const ONLINE_RECHARGE = `${PRE_FIX}ONLINE_RECHARGE`;
export const GET_EXCHANGE_RATE = `${PRE_FIX}GET_EXCHANGE_RATE`;
export const GET_RECHARGE_PLATFORM = `${PRE_FIX}GET_RECHARGE_PLATFORM`;
export const OFFLINE_RECHARGE = `${PRE_FIX}OFFLINE_RECHARGE`;


// ---------------------------------------------
// action creaters
// ---------------------------------------------



export const getMonthlyList = createAction(
  GET_MONTHLY_LIST,
  (pager=1, pageSize=10) => get({
    url: '/v2/os/products/app/consume/transaction/report?type=FOLLOW_ORDER',
    data: {
      pager,
      pageSize
    }
  })
);

export const getMonthlyDetail = createAction(
  GET_MONTHLY_DETAIL,
  (id, pager=1, pageSize=10) => get({
    url: '/v2/os/products/app/consume/transaction/detail',
    data: {
      id,
      pager,
      pageSize
    }
  })
);

export const getRechargePlatform = createAction(
  GET_RECHARGE_PLATFORM,
  () => get({
    url: '/v1/ops/tenants/payment/pay/platform'
  })
);

export const onlineRecharge = createAction(
  ONLINE_RECHARGE,
  ({ providerId, amount }) => post({
    url: '/v1/ops/tenants/payment/recharge/online',
    data: {
      providerId,
      amount
    }
  })
);

export const getExchangeRate = createAction(
  GET_EXCHANGE_RATE,
  () => get({
    url: '/v1/ops/product/exchange/rate/CNY/USD'
  })
);


export const offlineRecharge = createAction(
  OFFLINE_RECHARGE,
  ({ bills, amount }) => post({
    url: '/v2/os/tenants/recharge/remitting/bill',
    data: {
      bills,
      amount
    }
  })
);
