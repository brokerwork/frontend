import { handleActions } from 'redux-actions'

import { UPDATE_APPLY_BTN } from '../actions'

export const leveragePage = handleActions({
    [UPDATE_APPLY_BTN]: (state, {payload}) => { 
        return Object.assign({}, state, {
            isApply: payload
        })
    }
}, {
    isApply: true
})

