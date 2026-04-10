import { createAction } from 'redux-actions'

import { get, post } from 'utils/api'
import { Storage } from 'utils/storage'

export const UPDATE_DEAL_HISTORY = 'UPDATE_DEAL_HISTORY'
export const UPDATE_ORDER_HISTORY = 'UPDATE_ORDER_HISTORY'
export const UPDATE_POSITION_HISTORY = 'UPDATE_POSITION_HISTORY'

export const updateDealHistory = createAction(
    UPDATE_DEAL_HISTORY,
    (from, to, pageSize) => { 
        return get(`/v1/mobile/report/deal`, {
            data: {
                from: from,
                to: to,
                pageNumber: 1,
                pageSize: pageSize
            },
            headers: {
                'x-api-account-token': Storage.getString(Storage.Keys.ACCOUNT_TOKEN)
            }
        })
    }
)

export const updateOrderHistory = createAction(
    UPDATE_ORDER_HISTORY,
    (from, to, pageSize) => { 
        return get(`/v1/mobile/report/order`, {
            data: {
                from: from,
                to: to,
                pageNumber: 1,
                pageSize: pageSize
            },
            headers: {
                'x-api-account-token': Storage.getString(Storage.Keys.ACCOUNT_TOKEN)
            }
        })
    }
)

export const updatePositionHistory = createAction(
    UPDATE_POSITION_HISTORY,
    (from, to, pageSize) => { 
        return get(`/v1/mobile/report/position`, {
            data: {
                from: from,
                to: to,
                pageNumber: 1,
                pageSize: pageSize
            },
            headers: {
                'x-api-account-token': Storage.getString(Storage.Keys.ACCOUNT_TOKEN)
            }
        })
    }
)