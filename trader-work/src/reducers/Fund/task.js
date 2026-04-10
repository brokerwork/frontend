import { handleActions } from 'redux-actions'
import {
    FETCH_LIST,
} from '@/actions/Fund/task'

export const tradingList = handleActions({
    [FETCH_LIST]: (state, { payload }) => payload
}, {})
