import api from '@/api'
import { createAction } from 'redux-actions'

export const BIND_GET_SERVER_LIST = 'BIND_GET_SERVER_LIST'
export const BIND_SUB_FORM = 'BIND_SUB_FORM'

// 获取服务器列表
export const getServerList = createAction(
    BIND_GET_SERVER_LIST,
    vendor => api.get(`/v1/account/platform/${vendor}/server/list`)
)

//  提交绑定账户
export const subBindForm = createAction(
    BIND_SUB_FORM,
    (data) => { 
        return api.post('/v1/account/bind/check', {
            accountId: data.accountId,
            password: data.password,
            serverId: data.serverId,
            comment: data.comment,
            vendor: data.vendor
        })
    }
)

