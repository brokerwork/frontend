import { handleActions } from 'redux-actions'
import {
    OPEN_PLATFORM_LIST
} from '@/actions/Account/openAccount'

export const platformList = handleActions({
    [OPEN_PLATFORM_LIST]: (state, { payload }) => payload
}, [])
