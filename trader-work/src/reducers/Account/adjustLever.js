import { handleActions } from 'redux-actions'
import {
    LEVER_UPDATABLE,
} from '@/actions/Account/adjustLever'

export const lever = handleActions({
    [LEVER_UPDATABLE]: (state, { payload }) => payload
}, {})