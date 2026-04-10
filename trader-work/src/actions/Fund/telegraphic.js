import api from '@/api'
import { createAction } from 'redux-actions'

export const TELEGRAPHIC = 'TELEGRAPHIC'
export const TELEGRAPHIC_GET_VA = 'TELEGRAPHIC_GET_VA'
// 设置默认帐户
export const telegraphic = createAction(
    TELEGRAPHIC,
    data => api.post('/v1/fund/telegraphic/transfer/deposit',data).then(res=>Promise.resolve(res))
)
export const getVaInfo = createAction(
    TELEGRAPHIC_GET_VA,
    data => api.get('/v1/fund/personal/telegraphic/transfer/deposit').then(res=>Promise.resolve(res))
)
