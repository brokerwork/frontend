import api from '@/api'
import { createAction } from 'redux-actions'

export const REPORT_TRADE_REBATE = 'REPORT_TRADE_REBATE'
export const REPORT_CHARGE_REBATE = 'REPORT_CHARGE_REBATE'
export const REPORT_OTHER_REBATE = 'REPORT_OTHER_REBATE'
export const REPORT_GET_SERVER = 'REPORT_GET_SERVER'

//  交易返佣
export const getTradeRebate = createAction(
    REPORT_TRADE_REBATE,
    (serverId, customerId, params) => api.post(`/v1/report/tw/LotsNew/${serverId}/${customerId}`, params)
)

//  手续费返佣
export const getChargeRebate = createAction(
    REPORT_CHARGE_REBATE,
    (serverId, customerId, params) => api.post(`/v1/report/tw/CommissionCharge/${serverId}/${customerId}`, params)
)

//  其他返佣
export const getOtherRebate = createAction(
    REPORT_OTHER_REBATE,
    (serverId, customerId, params) => api.post(`/v1/report/tw/DProfit/${serverId}/${customerId}`, params)
)

//  获取平台服务器
export const getServer = createAction(
    REPORT_GET_SERVER,
    () => api.get('/v2/bw/account/dropdown/serverList')
)