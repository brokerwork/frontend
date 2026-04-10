import { handleActions } from 'redux-actions'
import {
    VOD_GET_VIDEO_REPLAY,
    VOD_RESET_VIDEO_REPLAY,
    VOD_GET_VIDEO_LIST,
    VOD_RESET_VIDEO_LIST,
} from '@/actions/Training/vod'

// 全部视频
export const videoReplay = handleActions({
    [VOD_RESET_VIDEO_REPLAY]: (state) => { 
        return {
            list: []
        }
    },
    [VOD_GET_VIDEO_REPLAY]: (state, { payload }) => {
        return {
            ...state,
            ...payload,
            list: state.list.concat(payload.list || [])
        }
    }
}, {
    list: []   
})

//  视频列表
export const videoList = handleActions({
    [VOD_RESET_VIDEO_LIST]: (state) => { 
        return {
            list: []
        }
    },
    [VOD_GET_VIDEO_LIST]: (state, { payload }) => { 
        return {
            ...state,
            ...payload,
            list: state.list.concat(payload.list || [])
        }
    }
}, {
    list: []    
})