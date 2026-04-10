import { createAction } from 'redux-actions'

import { get, post } from '../../../utils/api'
import uuid from 'uuid'
import {fetchDisclaimer as fetchAccountDisclaimer} from '../../SignupOpenAccount/actions'

export const OPEN_GET_INFO_FIELDS = 'OPEN_GET_INFO_FIELDS'
export const GET_OSS_SIGNATURE = 'GET_OSS_SIGNATURE'
export const UPDATE_FORM_DATA = 'UPDATE_FORM_DATA'
export const UPDATE_ERR_TEXT = 'UPDATE_ERR_TEXT'
export const OPEN_ACCT_SUB = 'OPEN_ACCT_SUB'
export const UPDATE_FIRST_INFO = 'UPDATE_FIRST_INFO'
export const UPDATE_SECOND_INFO = 'UPDATE_SECOND_INFO'
export const UPDATE_THIRD_INFO = 'UPDATE_THIRD_INFO'
export const SUBMIT_STEP = 'SUBMIT_STEP'
export const GET_APPLY_LIST = 'GET_APPLY_LIST'
export const GET_ORIGIN_INFO = 'GET_ORIGIN_INFO'
export const GET_PLATFORM_LIST = 'GET_PLATFORM_LIST'
export const APPLY_SAME_INFO = 'APPLY_SAME_INFO'
export const UPLOAD_PIC = 'UPLOAD_PIC'
export const TOGGLE_AGREEMENT_CHECKED_FLAG_ORAF = 'TOGGLE_AGREEMENT_CHECKED_FLAG_ORAF'
export const UPDATE_SAME_INFO_STEP_ONE = 'UPDATE_SAME_INFO_STEP_ONE'
export const UPDATE_SAME_INFO_STEP_TWO = 'UPDATE_SAME_INFO_STEP_TWO'
export const UPDATE_SAME_INFO_STEP_THR = 'UPDATE_SAME_INFO_STEP_THR'

export const updateSameStep1 = createAction(
    UPDATE_SAME_INFO_STEP_ONE,
    (step1) => step1
)
export const updateSameStep2 = createAction(
    UPDATE_SAME_INFO_STEP_TWO,
    (step2) => step2
)
export const updateSameStep3 = createAction(
    UPDATE_SAME_INFO_STEP_THR,
    (step3) => step3
)

export const getInfoFields = createAction(
    OPEN_GET_INFO_FIELDS,
    (vendor) => { 
        return get(`/api/v1/common/account/info/${vendor}/fields`)
    }
)

//  更新表单数据
export const updateFormData = createAction(
    UPDATE_FORM_DATA,
    (formData) => formData
)

//  更新表单验证提示
export const updateErrText = createAction(
    UPDATE_ERR_TEXT,
    (errText) => errText
)

//  选择图片后调用
export const getOssSignature = createAction(
    GET_OSS_SIGNATURE,
    (tenantId) => { 
        return get(`/api/ali/oss/signature?bucket=leanwork-fs&fid=${tenantId}/${uuid.v1()}`)
    }
)
//  上传图片
export const upload = createAction(
    UPLOAD_PIC,
    (url, data) => { 
        return post(url, {
            data: data
        })
    }
)

//  分步提交表单
export const submitStep = createAction(
    SUBMIT_STEP,
    (vendor, step, data) => { 
        return post(`/api/v1/account/apply/live/${vendor}/${step}`, {
            data: data
        })
    }
)

//  提交真实开户
export const openAcctSub = createAction(
    OPEN_ACCT_SUB,
    (vendor, data) => { 
        return post(`/api/v1/account/apply/live/${vendor}/submit?mobile=true`)
    }
)

//  更新基本信息
export const updateFirstInfo = createAction(
    UPDATE_FIRST_INFO,
    (firstInfo) => firstInfo
)

//  更新投资信息
export const updateSecondInfo = createAction(
    UPDATE_SECOND_INFO,
    (secondInfo) => secondInfo
)

//  更新身份信息
export const updateThirdInfo = createAction(
    UPDATE_THIRD_INFO,
    (thirdInfo) => thirdInfo
)

//  获取分步数据
export const getApplyList = createAction(
    GET_APPLY_LIST,
    (vendor, featureStatus) => {
        //  真实开户审核中
        if (featureStatus && featureStatus.LiveAccountApplicationInProgressing === 'Enabled') {
            return get(`/api/v1/account/apply/live/submitted?vendor=${vendor}`)
        } else { 
            return Promise.all([get(`/api/v1/account/apply/live?vendor=${vendor}`), get(`/api/v1/account/apply/customer/info?vendor=${vendor}`)]).then(res => { 
                let res1 = res[0]
                let res2 = res[1]
                let result = {}
                if (res1.result && res2.result) {
                    result.step1 = (res1.data && res1.data.step1 && Object.keys(res1.data.step1).length > 0) ? res1.data.step1 : res2.data.baseInfo
                    result.step2 = (res1.data && res1.data.step2 && Object.keys(res1.data.step2).length > 0) ? res1.data.step2 : res2.data.financialInfo
                    result.step3 = (res1.data && res1.data.step3 && Object.keys(res1.data.step3).length > 0) ? res1.data.step3 : res2.data.certificatesInfo
                    return Promise.resolve({ data: result, result: true })
                } else { 
                    if (!res1.result) {
                        return Promise.resolve(res1)
                    } else {
                        return Promise.resolve(res2)
                    }
                }
            })
        }
    }
)

//  获取同名账户信息
export const getOriginInfo = createAction(
    GET_ORIGIN_INFO,
    (vendor, featureStatus) => { 
        if (featureStatus && featureStatus.ApplyAccountWithSavedInfoInProgressing === 'Enabled') {
            return get(`/api/v1/account/apply/homonym/info?vendor=${vendor}`)
        } else { 
            return get('/api/v1/account/origin/info')
        }
    }
)

//  判断是否是同名账户
export const getPlatformList = createAction(
    GET_PLATFORM_LIST,
    (vendor) => { 
        return get('/api/v1/account/platform/list').then((res) => { 
            if (res.result) {
                let temp = {}
                res.data.forEach((item) => { 
                    if (item.vendor == vendor) {
                        temp = item
                    }
                })
                return Promise.resolve({
                    data: temp,
                    result: true
                })
            } else { 
                return Promise.resolve(res)
            }
        })
    }
)

//  提交同名账户申请
export const applySameInfo = createAction(
    APPLY_SAME_INFO,
    (vendor, data) => { 
        return post('/api/v1/account/apply/sameinfo?mobile=true', {
            data: {
                step1: data.step1,
                step2: data.step2,
                step3: data.step3,
                vendorType: vendor
            }
        })
    }
)

export const toggleAgreementCheckedFlag = createAction(TOGGLE_AGREEMENT_CHECKED_FLAG_ORAF)

export const fetchDisclaimer = fetchAccountDisclaimer