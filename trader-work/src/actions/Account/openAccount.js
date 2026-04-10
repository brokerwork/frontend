import api from '@/api'
import { createAction } from 'redux-actions'

export const OPEN_PLATFORM_LIST = 'OPEN_PLATFORM_LIST'
export const OPEN_SAVE_INFO = 'OPEN_SAVE_INFO'
export const OPEN_SAVE_CTID = 'OPEN_SAVE_CTID'

//  请求开户权限
export const getPlatformList = createAction(
    OPEN_PLATFORM_LIST,
    () => { 
        return api.get('/v1/account/platform/list')
    }
)
//  ctrader保存邮箱
export const saveInfo = createAction(
    OPEN_SAVE_INFO,
    (vendor, data) => { 
        return api.post(`/v1/account/apply/live/${vendor}/extendInfo`,data)
    }
)
//  ctrader保存邮箱到store
export const saveCtid = createAction(
    OPEN_SAVE_CTID,
    ctid => ctid
)
