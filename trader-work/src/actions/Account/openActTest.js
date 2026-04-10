import api from '@/api'
import { createAction } from 'redux-actions'

export const TEST_GET_QUESTION = 'TEST_GET_QUESTION'
export const TEST_SUB_QUESTION = 'TEST_SUB_QUESTION'

//  获取测试是否开启及题目
export const getQuestion = createAction(
    TEST_GET_QUESTION,
    () => { 
        return api.get('/v1/account/appropriatenessTest/info')
    }
)

//  提交答案
export const subQuestion = createAction(
    TEST_SUB_QUESTION,
    (Array) => { 
        return api.post('/v1/account/appropriatenessTest/answer', {
            "questions": Array
        })
    }
)

