import { handleActions } from 'redux-actions'

import {
    OPEN_GET_INFO_FIELDS,
    UPDATE_FORM_DATA,
    UPDATE_ERR_TEXT,
    UPDATE_FIRST_INFO,
    UPDATE_SECOND_INFO,
    UPDATE_THIRD_INFO,
    GET_PLATFORM_LIST,
    GET_ORIGIN_INFO,
    GET_APPLY_LIST,
    UPDATE_SAME_INFO_STEP_ONE,
    UPDATE_SAME_INFO_STEP_TWO,
    UPDATE_SAME_INFO_STEP_THR,
    TOGGLE_AGREEMENT_CHECKED_FLAG_ORAF,
} from '../actions'

export const openAcctStepPage = handleActions({
    [OPEN_GET_INFO_FIELDS]: (state, { payload }) => {
        return Object.assign({}, state, {
            fieldsInfo: payload.data
        })
    },
    [UPDATE_ERR_TEXT]: (state, { payload }) => { 
        return Object.assign({}, state, {
            errText: payload
        })
    },
    [UPDATE_FIRST_INFO]: (state, { payload }) => { 
        return Object.assign({}, state, {
            firstInfo: payload
        })
    },
    [UPDATE_SECOND_INFO]: (state, { payload }) => { 
        return Object.assign({}, state, {
            secondInfo: payload
        })
    },
    [UPDATE_THIRD_INFO]: (state, { payload }) => { 
        return Object.assign({}, state, {
            thirdInfo: payload
        })
    },
    [GET_PLATFORM_LIST]: (state, { payload }) => { 
        return Object.assign({}, state, {
            isSame: payload.data.featureStatus && (payload.data.featureStatus.ApplyAccountWithSavedInfo === 'Enabled' || payload.data.featureStatus.ApplyAccountWithSavedInfoInProgressing === 'Enabled')
        })
    },
    [GET_ORIGIN_INFO]: (state, { payload }) => { 
        return Object.assign({}, state, {
            sameInfo: {
                baseInfo: payload.data.baseInfo || payload.data.step1,
                financialInfo: payload.data.financialInfo || payload.data.step2,
                certificatesInfo: payload.data.certificatesInfo || payload.data.step3,
            }
        })
    },
    [TOGGLE_AGREEMENT_CHECKED_FLAG_ORAF]: function (state) {
        return Object.assign( {}, state, {
          agreementChecked: !state.agreementChecked
        } )
    },
    [GET_APPLY_LIST]: (state, { payload }) => { 
        return Object.assign({}, state, {
            stepInfo: {
                step1: payload.data.step1 || payload.data.baseInfo,
                step2: payload.data.step2 || payload.data.financialInfo,
                step3: payload.data.step3 || payload.data.certificatesInfo
            }
        })
    },
    [UPDATE_SAME_INFO_STEP_ONE]: (state, { payload }) => { 
        return Object.assign({}, state, {
            sameStep1: payload
        })
    },
    [UPDATE_SAME_INFO_STEP_TWO]: (state, { payload }) => { 
        return Object.assign({}, state, {
            sameStep2: payload
        })
    },
    [UPDATE_SAME_INFO_STEP_THR]: (state, { payload }) => { 
        return Object.assign({}, state, {
            sameStep3: payload
        })
    }
}, {
        fieldsInfo: {},
        errText: {},
        firstInfo: [],
        secondInfo: [],
        thirdInfo: [],
        isSame: false,
        sameInfo: {},
        agreementChecked: false,
        stepInfo: {},
        sameStep1: {},
        sameStep2: {},
        sameStep3: {},
})

//  更新表单数据
export const formData = handleActions({
    [UPDATE_FORM_DATA]: (state, { payload }) => {
        return payload
    }
}, {})