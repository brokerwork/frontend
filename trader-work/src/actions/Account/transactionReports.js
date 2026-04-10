import api from '@/api'
import { createAction } from 'redux-actions'

export const TRANSACTIONREPORTS_FETCH_LIST = 'TRANSACTIONREPORTS_FETCH_LIST'

// 获取报表
export const fetchReports = createAction(
    TRANSACTIONREPORTS_FETCH_LIST,
    (params) => api.get(`/v1/trade/report/${params.type}`, {
        from: params.from,
        to: params.to,
        size: params.size,
        page: params.page
    })
)

