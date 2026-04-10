import api from '@/api'
import { createAction } from 'redux-actions'

export const APPROPRIATE_TEST_RESULT = 'APPROPRIATE_TEST_RESULT'
// 获取适当性测试结果
export const getAppropriateTest = createAction(
    APPROPRIATE_TEST_RESULT,
    () => api.get('/v1/account/appropriatenessTest/result')
)

