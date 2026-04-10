import api from '@/api'
import { createAction } from 'redux-actions'

const PREFIX = 'TRADINGFLOWTASK_'
export const FETCH_LIST = `${PREFIX}FETCH_LIST`

export const fetchList = createAction(
    FETCH_LIST,
    params => api.get('/v1/fund/transaction',params)
)
