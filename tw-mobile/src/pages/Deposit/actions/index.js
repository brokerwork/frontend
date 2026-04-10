import { createAction } from 'redux-actions';
import { get } from 'utils/api'
import { UserInfo, getCachedToken } from 'utils/userinfo';

export const UPDATE_DEPOSITAMOUNT = 'UPDATE_DEPOSITAMOUNT';
export const UPDATE_PAYAMOUNT = 'UPDATE_PAYAMOUNT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const SET_FIELD_ERROR_TEXT = 'SET_FIELD_ERROR_TEXT';
export const FETCH_REALTIME_EXCHANGES = 'FETCH_REALTIME_EXCHANGES';
export const UPDATE_SELECTED_PAYMETHOD = 'UPDATE_SELECTED_PAYMETHOD';
export const UPDATE_CURRENT_RATE_SETTING = 'UPDATE_CURRENT_RATE_SETTING';
export const UPDATE_EXCHANGE = 'UPDATE_EXCHANGE';
export const UPDATE_PAYCURRENCY = "UPDATE_PAYCURRENCY";
export const UPDATE_DEPOSIT_AMOUNT_VALIDATION = "UPDATE_DEPOSIT_AMOUNT_VALIDATION";
export const FETCH_LIVE_EXCHANGE = "FETCH_LIVE_EXCHANGE";
export const UPDATE_PARAMS = "UPDATE_PARAMS";
export const UPDATE_DEPOSIT_SETTING = 'UPDATE_DEPOSIT_SETTING'
export const GET_DEPOSIT_CONFIG = 'GET_DEPOSIT_CONFIG'

export const updateParams = createAction(
    UPDATE_PARAMS,
    (params)  => params
)

export const updateDepositAmountValidation = createAction(
    UPDATE_DEPOSIT_AMOUNT_VALIDATION,
    ( validation ) => validation
)

export const updateDepositAmount = createAction(
    UPDATE_DEPOSITAMOUNT,
    ( depositAmount ) => depositAmount
)

export const updatePayAmount = createAction(
    UPDATE_PAYAMOUNT,
    ( payAmount ) => payAmount
)

export const updateComment = createAction(
    UPDATE_COMMENT,
    ( comment ) => comment
)

export const updateSelectedPaymethod = createAction(
    UPDATE_SELECTED_PAYMETHOD,
    ( selectedPaymethod ) => selectedPaymethod
)

export const updateCurrentRateSetting = createAction(
    UPDATE_CURRENT_RATE_SETTING,
    ( currentRateSetting ) => currentRateSetting
)

export const updateExchange = createAction(
    UPDATE_EXCHANGE,
    ( exchange ) => exchange
)

export const updatePayCurrency = createAction(
    UPDATE_PAYCURRENCY,
    ( payCurrency ) => payCurrency
)

export const setFieldErrorText = createAction(
    SET_FIELD_ERROR_TEXT,
    ( fieldKey , errorText ) => {
        return { key: fieldKey , value: errorText }
    }
)

export const getDepositConfig = createAction(
    GET_DEPOSIT_CONFIG,
    (vendor) => {
        return get(`/v1/mobile/depositSetting?vendor=${vendor}`)
    }
)