import { createAction } from 'redux-actions'

import api from '@/api'

export const REGISTERREAL_FETCHITEMS = 'REGISTERREAL_FETCHITEMS'
export const REGISTERREAL = 'REGISTERREAL'


export const fetchItems = createAction(
    REGISTERREAL_FETCHITEMS,
    vender => api.get(`/v1/config/account/info/${vender}/fields`)
)
export const registerReal = createAction(
    REGISTERREAL,
    (data) => api.post(`/v2/user/real/signupopen`,data)
)




