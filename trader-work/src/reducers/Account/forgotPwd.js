import { handleActions } from 'redux-actions'
import {
    FORGOTPWD_STATUS,
} from '@/actions/Account/forgotPwd'

export const forgotState = handleActions({
    [FORGOTPWD_STATUS]: (state, { payload }) => payload
}, true)

