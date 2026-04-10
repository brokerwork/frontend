import api from '@/api'
import { createAction } from 'redux-actions'

export const LIVE_GET_VIDEO_LIST = 'LIVE_GET_VIDEO_LIST'
export const LIVE_RESET_VIDEO_LIST = 'LIVE_RESET_VIDEO_LIST'
export const LIVE_GET_WEBCAST = 'LIVE_GET_WEBCAST'
export const LIVE_VISIT_GET_WEBCAST = 'LIVE_VISIT_GET_WEBCAST'
export const LIVE_SEND_COMMENT = 'LIVE_SEND_COMMENT'
export const LIVE_DELETE_COMMENT = 'LIVE_DELETE_COMMENT'
export const LIVE_GET_WEBCAST_USER_INFO = 'LIVE_GET_WEBCAST_USER_INFO'
export const LIVE_FORBID_SEND_COMMENT = 'LIVE_FORBID_SEND_COMMENT'
export const LIVE_GET_COMMENT_LIST = 'LIVE_GET_COMMENT_LIST'

// 获取直播列表
export const getLiveVideoList = createAction(
    LIVE_GET_VIDEO_LIST,
    (page, size) => { 
        return api.get(`/v1/video/live/list?page=${page}&size=${size}`)
    }
)

//  置空直播列表
export const resetLiveVideoList = createAction(
    LIVE_RESET_VIDEO_LIST
)

//  普通用户获取视频直播
export const getLiveWebcast = createAction(
    LIVE_GET_WEBCAST,
    (id) => { 
        return api.get(`/v1/video/live?id=${id}`)
    }
)

//  添加评论
export const sendComment = createAction(
    LIVE_SEND_COMMENT,
    (params) => { 
        return api.post('/v1/video/comment', {
            userId: params.userId,
            liveId: params.liveId,
            comment: params.comment,
        })
    },
    () => {
        return {noMask: true}
    }
)

//  删除评论
export const deleteComment = createAction(
    LIVE_DELETE_COMMENT,
    (params) => { 
        return api.delete('/v1/video/comment', {
            liveId: params.liveId,
            index: params.index,
        })
    }
)

//  获取用户状态
export const getWebcastUserInfo = createAction(
    LIVE_GET_WEBCAST_USER_INFO,
    (params) => { 
        return api.get('/v1/video/user_info', {
            userId: params.userId,
            liveId: params.liveId,
        })
    }
)

//  管理员修改用户状态 (禁言)
export const isBanSendComment = createAction(
    LIVE_FORBID_SEND_COMMENT,
    (params) => { 
        return api.post('/v1/video/user_info', {
            userId: params.userId,
            liveId: params.liveId,
            disable: params.disable,
        })
    },
    () => {
        return {noMask: true}
    }
)

/******** 兼容游客 *******/

//  游客获取视频直播
export const visitGetLiveWebcast = createAction(
    LIVE_VISIT_GET_WEBCAST,
    (roomId) => { 
        return api.get(`/v1/live/nologin/info?roomId=${roomId}`)
    }
)

//  获取评论列表
export const getCommentList = createAction(
    LIVE_GET_COMMENT_LIST,
    (params) => { 
        return api.get('/v1/video/comment/list', {
            liveId: params.liveId,
            index: params.index,
            count: params.count,
        })
    },
    () => {
        return {noMask: true}
    }
)