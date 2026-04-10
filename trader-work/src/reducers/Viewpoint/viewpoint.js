import { handleActions, handleAction } from 'redux-actions'
import {
    VIEWPOINT_DES
} from '@/actions/Viewpoint/viewpoint'

// 全部视频列表
export const tkn = handleActions({
    [VIEWPOINT_DES]: (state, { payload }) => payload
}, null)