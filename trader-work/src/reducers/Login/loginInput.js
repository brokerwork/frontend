import { handleActions } from 'redux-actions'

import {
    LOGIN_LOGIN,
    FETCHBWBRANDINFO
} from '@/actions/Login/loginInput'

//  登录结果
export const loginResult = handleActions({
    [LOGIN_LOGIN]: (state, { type, payload }) => payload,
    [FETCHBWBRANDINFO]: (state, { type, payload }) => payload
}, {})