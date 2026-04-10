import api from '@/api'
import { createAction } from 'redux-actions'

export const VIEWPOINT_DES = 'VIEWPOINT_DES'

//  加密参数
export const encrypt = createAction(
    VIEWPOINT_DES,
    params => api.post(`/v1/all/encrypter/encrypt`, params)
)
