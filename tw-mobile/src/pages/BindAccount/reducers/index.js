import { handleActions } from 'redux-actions'

import {
    GET_SERVER_LIST
} from '../actions'

export const bindAccountPage = handleActions({
    [GET_SERVER_LIST]: (state, { payload }) => { 
        console.log('====', payload)
        return Object.assign({}, state, {
            serverList: payload.data
        })
    }
}, {
    serverList: []
})
  
  