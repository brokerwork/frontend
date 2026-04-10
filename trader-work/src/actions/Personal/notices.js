import api from '@/api'
import { createAction } from 'redux-actions'

export const NOTICES_FETCH_LIST = 'NOTICES_FETCH_LIST'
export const NOTICES_FETCH_DETAIL = 'NOTICES_FETCH_DETAIL'
export const NOTICES_READALL = 'NOTICES_READALL'
export const NOTICES_READSOME = 'NOTICES_READSOME'
// 获取消息列表
export const getNotices = createAction(
    NOTICES_FETCH_LIST,
    page => api.post('/v1/message/list',{
        "page":page,
        "size":10,
        "queryContent":"",
        "queryKey":"title",
        "queryType":"INBOX",
        "type":"ALL"
    })
)
// 获取消息详情
export const getNotice = createAction(
    NOTICES_FETCH_DETAIL,
    id => api.post(`/v1/message/${id}`)
)
// 标记全部为已读
export const readAll = createAction(
    NOTICES_READALL,
    page => api.post('/v1/message/isReadAll')
)
// 标记多条消息为已读
export const readSome = createAction(
    NOTICES_READSOME,
    ids => api.post('/v1/message/isRead',ids)
)




