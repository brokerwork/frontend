import { handleActions } from 'redux-actions'
import {
    TRANSFER,
} from '@/actions/Fund/transfer'

export const serverList = handleActions({
    [TRANSFER]: (state, { payload }) => payload
}, [])
