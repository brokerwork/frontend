import api from '@/api'
import { createAction } from 'redux-actions'

export const LINK_GET = 'LINK_GET'

export const getLink = createAction(
    LINK_GET,
    () => api.get('/v1/ops/product/conf/download/center')
)