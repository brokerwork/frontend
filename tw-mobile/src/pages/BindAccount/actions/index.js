import { createAction } from 'redux-actions'

import { get, post } from 'utils/api'

export const BIND_CHECK = 'BIND_CHECK'
export const GET_SERVER_LIST = 'GET_SERVER_LIST'

export const bindCheck = createAction(
    BIND_CHECK,
    (bindData) => {
        return post('/api/v1/account/bind/check', {
            data: {
                accountId: bindData.accountId,
                accountName: bindData.accountName,
                comment: bindData.comment,
                password: bindData.password,
                serverId: bindData.serverId,
                vendor: bindData.vendor
            }
        })
    }
)

export const getServerList = createAction(
    GET_SERVER_LIST,
    (vendor) => { 
        return get(`/api/v1/account/platform/${vendor}/server/list`)
    }
)