import { handleActions } from 'redux-actions'
import {
    ACCOUNT_INFO_FIELDS,
} from '@/actions/Personal/accountInfo'

export const fields = handleActions({
    [ACCOUNT_INFO_FIELDS]: (state, { payload }) => payload,
}, null)