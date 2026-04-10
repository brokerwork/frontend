import {
	handleActions
} from 'redux-actions';

import {
	GET_BANK_LIST,
	GET_BANK_INFO,
	GET_AMOUNT,
	GET_ACCOUNT_WITHDRAW_INFO
} from '../actions'

export const withDrawPage = handleActions({
	[GET_BANK_LIST]: (state,{payload}) => {
		return Object.assign({}, state, {
			bankList: payload.data
		})
	},
	[GET_BANK_INFO]: (state,{payload}) => {
		return Object.assign({}, state, {
			bankInfo: payload.data
		})
	},
	[GET_ACCOUNT_WITHDRAW_INFO]: (state, { payload }) => {
		return Object.assign({}, state, {
			withDrawInfo: payload.data
		})
	},
	[GET_AMOUNT]: (state, { payload }) => {
		return Object.assign({}, state, {
			curMaxWithdrawAmount: payload.data
		})
	 }
}, {
		curMaxWithdrawAmount: '',
		bankList: [],
		bankInfo: {},
		withDrawInfo: {}
	})