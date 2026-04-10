import { handleActions } from 'redux-actions'
import {
    NOTICES_FETCH_LIST,
    NOTICES_FETCH_DETAIL
} from '@/actions/Personal/notices'

export const notices = handleActions({
    [NOTICES_FETCH_LIST]: (state,{ type, payload })=>payload.list || []
}, [])
export const notice = handleActions({
    [NOTICES_FETCH_DETAIL]: (state,{ type, payload })=>payload
}, [])
