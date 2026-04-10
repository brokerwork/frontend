import { handleActions } from 'redux-actions'
import {
    TRANSACTIONREPORTS_FETCH_LIST,
} from '@/actions/Account/transactionReports'

export const transactionReports = handleActions({
    [TRANSACTIONREPORTS_FETCH_LIST]: (state, { payload }) => payload
}, {})