import api from '@/api'
import { createAction } from 'redux-actions'
import { create } from 'domain';

export const VOD_GET_VIDEO_REPLAY = 'VOD_GET_VIDEO_REPLAY'
export const VOD_RESET_VIDEO_REPLAY = 'VOD_RESET_VIDEO_REPLAY'
export const VOD_GET_VIDEO_LIST = 'VOD_GET_VIDEO_LIST'
export const VOD_RESET_VIDEO_LIST = 'VOD_RESET_VIDEO_LIST'

// 获取全部视频
export const getVideoReplay = createAction(
    VOD_GET_VIDEO_REPLAY,
    (page, size) => { 
        return api.get(`/v1/video/replay/class_list?page=${page}&size=${size}`)
    }
)
//  置空全部视频
export const resetVideoReplay = createAction(
    VOD_RESET_VIDEO_REPLAY
)

//  获取视频列表
export const getVideoList = createAction(
    VOD_GET_VIDEO_LIST,
    (page, size, id) => { 
        return api.get(`/v1/video/replay/video_list?page=${page}&size=${size}&id=${id}`)
    }
)
//  置空视频列表
export const resetVideoList = createAction(
    VOD_RESET_VIDEO_LIST
)
