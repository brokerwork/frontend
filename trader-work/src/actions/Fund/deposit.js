import api from '@/api'
import { createAction } from 'redux-actions'

const PREFIX = 'DEPOSIT_'
export const FETCH_ACCOUNT = `${PREFIX}FETCH_ACCOUNT`

export const fetchAccountBelong = createAction(
    FETCH_ACCOUNT,
    (serverId, login) => api.get(`/v1/account/group/${serverId}/${login}`)
)

