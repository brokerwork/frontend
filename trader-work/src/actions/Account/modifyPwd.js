import api from '@/api'
import { createAction } from 'redux-actions'

export const MODIFY_PWD = 'MODIFY_PWD'

export const modifyPwd = createAction(
    MODIFY_PWD,
    (params) => api.post('/v1/account/changePwd', params)
)
