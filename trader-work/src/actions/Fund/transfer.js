import api from '@/api'
import { createAction } from 'redux-actions'
import { fetchRestAmount as fetchRestAmount1 } from './withdraw'

const PREFIX = 'TRANSFER_'
export const FETCH_PLATFORMS = `${PREFIX}FETCH_PLATFORMS`
export const FETCH_RESTAMOUNT = `${PREFIX}FETCH_RESTAMOUNT`
export const SAVE_TRANSFER = `${PREFIX}SAVE_TRANSFER`
export const CONFIRM = `${PREFIX}CONFIRM`

export const fetchPlatforms = createAction(
  FETCH_PLATFORMS,
    data => api.get(`/v1/account/platform/${data}/server/list`)
)
export const fetchRestAmount = createAction(
  FETCH_RESTAMOUNT,
    data => dispatch =>{
        return dispatch(fetchRestAmount1())
    }
)
export const saveTransfer = createAction(
  SAVE_TRANSFER,
    data => api.post('/v1/fund/transfer/cross/verification',data)
)
export const confirm = createAction(
  CONFIRM,
    data => api.post('/v1/fund/transfer',data)
)
