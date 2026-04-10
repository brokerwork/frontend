import { handleActions } from 'redux-actions'

import {
    UPDATE_DEAL_HISTORY,
    UPDATE_ORDER_HISTORY,
    UPDATE_POSITION_HISTORY
} from '../actions'

export const tradereportsPage = handleActions({
    [UPDATE_DEAL_HISTORY]: (state, { payload }) => {
        return Object.assign({}, state, {
            dealHistoryArr: payload.data.list
        })
    },
    [UPDATE_ORDER_HISTORY]: (state, { payload }) => {
        return Object.assign({}, state, {
            orderHistoryArr: payload.data.list
        })
    },
    [UPDATE_POSITION_HISTORY]: (state, { payload }) => {
        return Object.assign({}, state, {
            positionHistoryArr: payload.data.list
        })
    }
}, {
        dealHistoryArr: [],
        orderHistoryArr: [],
        positionHistoryArr: []
})