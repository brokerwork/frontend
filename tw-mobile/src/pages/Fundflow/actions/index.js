import { createAction } from 'redux-actions'

import { get, post } from '../../../utils/api'

export const DEPOSIT_GET_DATA = 'DEPOSIT_GET_DATA'
export const WITHDRAW_GET_DATA = 'WITHDRAW_GET_DATA'
export const TRANSFER_GET_DATA = 'TRANSFER_GET_DATA'

export const fetchDepositData = createAction(
    DEPOSIT_GET_DATA,
    (url, options) => { 
        return get(url, options)
    }
)

export const fetchWithdrawData = createAction(
    WITHDRAW_GET_DATA,
    (url, options) => { 
        return get(url, options)
    }
)

export const fetchTransferData = createAction(
    TRANSFER_GET_DATA,
    (url, options) => { 
        return get(url, options)
    }
)