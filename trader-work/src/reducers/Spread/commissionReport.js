import { handleActions } from 'redux-actions'

import {
    REPORT_TRADE_REBATE,
    REPORT_CHARGE_REBATE,
    REPORT_OTHER_REBATE,
    REPORT_GET_SERVER,
} from '@/actions/Spread/commissionReport'

export const tradeRebate = handleActions({
    [REPORT_TRADE_REBATE]: (state, { payload }) => payload
}, null)

export const chargeRebate = handleActions({
    [REPORT_CHARGE_REBATE]: (state, { payload }) => payload
}, null)

export const otherRebate = handleActions({
    [REPORT_OTHER_REBATE]: (state, { payload }) => payload
}, null)

export const serverList = handleActions({
    [REPORT_GET_SERVER]: (state, { payload }) => payload
}, null)