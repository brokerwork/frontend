import { handleActions } from 'redux-actions'
import {
    TEST_GET_QUESTION,
} from '@/actions/Account/openActTest'

export const questionData = handleActions({
    [TEST_GET_QUESTION]: (state, { payload }) => payload
}, {})