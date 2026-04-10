import { handleActions, handleAction } from 'redux-actions'
import {
    LIVE_GET_VIDEO_LIST,
    LIVE_RESET_VIDEO_LIST,
    LIVE_GET_WEBCAST_USER_INFO,
} from '@/actions/Training/live'

// 全部视频列表
export const liveVideoList = handleActions({
    [LIVE_RESET_VIDEO_LIST]: () => { 
        return {
            list: []
        }
    },
    [LIVE_GET_VIDEO_LIST]: (state, { payload }) => {
        return {
            ...state,
            ...payload,
            list: state.list.concat(payload.list || [])
        }
    }
}, {
    list: []   
})