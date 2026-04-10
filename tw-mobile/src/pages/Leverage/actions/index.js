import { createAction } from 'redux-actions'

import { get, post } from '../../../utils/api'
import { Storage } from '../../../utils/storage'

export const UPDATE_APPLY_BTN = 'UPDATE_APPLY_BTN'
export const APPLY_LEVERAGE = 'APPLY_LEVERAGE'
export const UPDATE_LEVERAGE = 'UPDATE_LEVERAGE'

export const updateApply = createAction(
    UPDATE_APPLY_BTN,
    (boolean) => boolean
)

export const applyLeverage = createAction(
    APPLY_LEVERAGE,
    (cur, exp, con) => {
        return post('/v1/mobile/account/leverage', {
            headers: {
                'x-api-account-token': Storage.getString(Storage.Keys.ACCOUNT_TOKEN)
            },
            data: {
                currentLeverage: ''+cur,
                expectedLeverage: ''+exp,
                comment: con
            }
        })
    }    
)

export const updatableLeverage = createAction(
    UPDATE_LEVERAGE,
    () => { 
        return get('/v1/mobile/account/leverage/updatable', {
            headers: {
                'x-api-account-token': Storage.getString(Storage.Keys.ACCOUNT_TOKEN)
            },
        })
    }
)