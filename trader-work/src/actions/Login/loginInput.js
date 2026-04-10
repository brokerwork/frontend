import { createAction } from 'redux-actions'
import {createAESKey} from '@/utils/encryption'


import api from '@/api'

export const LOGIN_LOGIN = 'LOGIN_LOGIN'
export const FETCHBWBRANDINFO = 'FETCHBWBRANDINFO'


//  登录
export const login = createAction(
    LOGIN_LOGIN,
    params => { 
        return api.post('/v2/user/loginWithType', {
            ...params,
            key: createAESKey(),
            autoAuth: true
        })
    }
)

export const fetchBWBrandInfo = createAction(
    FETCHBWBRANDINFO,
    (data) => { 
        return api.get('/v1/config/brand?productId=BW')
    }
)
