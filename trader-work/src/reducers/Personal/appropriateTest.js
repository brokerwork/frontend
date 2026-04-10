import { handleActions } from 'redux-actions'
import {
    APPROPRIATE_TEST_RESULT,
} from '@/actions/Personal/appropriateTest'

export const appropriateTestResult = handleActions({
    [APPROPRIATE_TEST_RESULT]: (state, { payload }) => payload
}, null)

