import { handleActions } from 'redux-actions'
import {
    FETCH_LIST,
} from '@/actions/Fund/tradingFlow'

export const tradingFlowList = handleActions({
    [FETCH_LIST]: (state, { payload }) => payload
}, {})
