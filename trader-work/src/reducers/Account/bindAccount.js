import { handleActions } from 'redux-actions'
import {
    BIND_GET_SERVER_LIST,
} from '@/actions/Account/bindAccount'

export const serverList = handleActions({
    [BIND_GET_SERVER_LIST]: (state, { payload }) => payload
}, [])

