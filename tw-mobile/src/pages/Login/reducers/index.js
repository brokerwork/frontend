import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
	LOGIN_BY_MAIL,
	LOGIN_BY_PHONE,
	UPDATE_EMAIL,
	UPDATE_EMAIL_PWD,
	UPDATE_EMAIL_ERROR_TEXT,
	UPDATE_EMAIL_PWD__ERROR_TEXT,
	UPDATE_PHONE,
	UPDATE_PHONE_PWD,
	UPDATE_PHONE_ERROR_TEXT,
	UPDATE_PHONE_PWD__ERROR_TEXT
} from '../actions';

export const loginPage = handleActions({
	[UPDATE_EMAIL]: (state, action) => {
		return Object.assign({}, state, {
			email: action.payload
		})
	},
	[UPDATE_EMAIL_PWD]: (state, action) => {
		return Object.assign({}, state, {
			emailPwd: action.payload
		})
	},
	[UPDATE_EMAIL_ERROR_TEXT]: (state, action) => {
		return Object.assign({}, state, {
			emailErrorText: action.payload
		})
	},
	[UPDATE_EMAIL_PWD__ERROR_TEXT]: (state, action) => {
		return Object.assign({}, state, {
			emailPwdErrorText: action.payload
		})
	},
	[UPDATE_PHONE]: (state, action) => {
		return Object.assign({}, state, {
			phone: action.payload
		})
	},
	[UPDATE_PHONE_PWD]: (state, action) => {
		return Object.assign({}, state, {
			phonePwd: action.payload
		})
	},
	[UPDATE_PHONE_ERROR_TEXT]: (state, action) => {
		return Object.assign({}, state, {
			phoneErrorText: action.payload
		})
	},
	[UPDATE_PHONE_PWD__ERROR_TEXT]: (state, action) => {
		return Object.assign({}, state, {
			phonePwdErrorText: action.payload
		})
	}
}, {
		username: '',
		wxname: '',
		phone: '',
		phonePwd: "",
		phoneErrorText: null,
		phonePwdErrorText: null,
		email: '',
		emailPwd: '',
		emailErrorText: null,
		emailPwdErrorText: null,
		language: '',
		lastLoginTime: ''
	})