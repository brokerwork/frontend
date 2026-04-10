import {
	handleActions
} from 'redux-actions';

import {
	UPDATE_DEPOSITAMOUNT,
	UPDATE_PAYAMOUNT,
	UPDATE_PAYMETHOD,
	UPDATE_COMMENT,
	SET_FIELD_ERROR_TEXT,
	FETCH_REALTIME_EXCHANGES,
	UPDATE_SELECTED_PAYMETHOD,
	UPDATE_CURRENT_RATE_SETTING,
	UPDATE_EXCHANGE,
	UPDATE_PAYCURRENCY,
	UPDATE_DEPOSIT_AMOUNT_VALIDATION,
	UPDATE_PARAMS
} from '../actions'

export const depositPage = handleActions({
	[UPDATE_PARAMS]: (state,{payload}) => {
		return Object.assign({}, state, {
			params: payload
		})
	},
	[FETCH_REALTIME_EXCHANGES]: (state, {
		payload
	}) => {
		return Object.assign({}, state, {
			exchange: payload
		})
	},
	[UPDATE_DEPOSIT_AMOUNT_VALIDATION]: (state, { payload }) => {
		return Object.assign({}, state, {
			depositAmountValidation: payload
		})
	},
	[UPDATE_DEPOSITAMOUNT]: (state, {
		payload
	}) => {
		return Object.assign({}, state, {
			depositAmount: payload
		})
	},
	[UPDATE_PAYAMOUNT]: (state, {
		payload
	}) => {
		return Object.assign({}, state, {
			payAmount: payload
		})
	},
	[UPDATE_PAYMETHOD]: (state, {
		payload
	}) => {
		return Object.assign({}, state, {
			payMethod: payload
		})
	},
	[UPDATE_COMMENT]: (state, {
		payload
	}) => {
		return Object.assign({}, state, {
			comment: payload
		})
	},
	[UPDATE_SELECTED_PAYMETHOD]: (state, {
		payload
	}) => {
		return Object.assign({}, state, {
			selectedPaymethod: payload
		})
	},
	[UPDATE_CURRENT_RATE_SETTING]: (state, {
		payload
	}) => {
		return Object.assign({}, state, {
			currentRateSetting: payload
		})
	},
	[UPDATE_EXCHANGE]: (state, { payload }) => {
		return Object.assign({}, state, {
			exchange: payload
		})
	},
	[UPDATE_PAYCURRENCY]: (state, { payload }) => {
		return Object.assign({}, state, {
			payCurrency: payload
		})
	},
	[SET_FIELD_ERROR_TEXT]: (state, {
		payload
	}) => {
		return Object.assign({}, state, {
			[payload.key]: payload.value
		})
	}
}, {
		depositAmount: '',
		payAmount: '',
		comment: '',
		selectedPaymethod: null,
		exchange: null,
		payCurrency: '',
		depositCurrency: null,
		depositAmountValidation: false,
		currentRateSetting: null,
		params: null
	})