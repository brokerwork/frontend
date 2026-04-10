import { handleActions } from 'redux-actions'

import { TELEGRAPHIC_TRANSFER_DEPOSIT } from '../actions'

export const telegraphicPage = handleActions({
    [TELEGRAPHIC_TRANSFER_DEPOSIT]: (state, { payload }) => { 
        return Object.assign({}, state, {
            telegraphicForm: payload
        })
    }
}, {
    telegraphicForm: {}
})