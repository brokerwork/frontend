import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
	IS_LOADING,
	COMMON_UPDATE_DEPOSIT_CONFIG,
	COMMON_UPDATE_SELECTED_ACCOUNT,
	COMMON_UPDATE_USER_INFO,
	COMMON_FETCH_BRAND_INFO,
	COMMON_APP_READY,
	GET_STRUCTURAL_LIST,
	OPEN_MSG_DIALOG,
	CLOSE_MSG_DIALOG,
	COMMON_GET_COUNTRY_PHONE,
	COMMON_CHECK_TOKEN,
	COMMON_GET_COUNTRIES,
	COMMON_GET_NATION,
	VISIBLE_MODULES,
	COMMON_FETCH_SERVER_NAME_ORAF,
} from './commonActions';

export let common = handleActions({
	[OPEN_MSG_DIALOG]: (state, { payload }) => {
		return Object.assign({}, state, {
			msg: payload
		})
	},
	[CLOSE_MSG_DIALOG]: (state, { payload }) => { 
		return Object.assign({}, state, {
			msg: ''
		})
	},
	[IS_LOADING]: (state, { payload }) => { 
		return Object.assign({}, state, {
			isLoading: payload
		})
	},
	[COMMON_UPDATE_DEPOSIT_CONFIG]: (state, { payload }) => {
		return Object.assign({}, state, {
			depositSetting: parseDepositSetting(payload)
		})
	},
	[COMMON_UPDATE_SELECTED_ACCOUNT]: (state, { payload }) => {
		return Object.assign({}, state, {
			selectedAccount: payload
		})
	},
	[COMMON_UPDATE_USER_INFO]: (state, { payload }) => {
		return Object.assign({}, state, {
			userinfo: payload
		})
	},
	[COMMON_FETCH_BRAND_INFO]: (state, { payload }) => {
		return Object.assign({}, state, {
			brand: payload.data
		})
	},
	[COMMON_APP_READY]:(state, {payload}) => {
		return Object.assign({}, state, {isApplicationReady: payload})
	},
	[GET_STRUCTURAL_LIST]: (state, { payload }) => { 
		return Object.assign({}, state, {
			structuralList: payload.data
		})
	},
	[COMMON_GET_COUNTRY_PHONE]: (state, { payload }) => {
		return Object.assign({}, state, {
			countryPhone: payload.data
		})
	},
	[COMMON_GET_COUNTRIES]: (state, { payload }) => {
		return Object.assign({}, state, {
			countryInfo: payload.data
		})
	},
	[COMMON_GET_NATION]: (state, { payload }) => {
		return Object.assign({}, state, {
			nationInfo: payload.data
		})
	},	
	[VISIBLE_MODULES]: function (state, { payload }) {
		return Object.assign({}, state, {
			visibleData: payload.data
		})
	},
	[COMMON_FETCH_SERVER_NAME_ORAF]: (state, { payload }) => { 
		let commonServerNames = payload.data.map(o=>{
			return {serverName: o.serverName, vendor: o.vendor}
		  })
		return Object.assign({}, state, {
			commonServerNames
		})
	},
	[COMMON_CHECK_TOKEN]: (state, { payload }) => Object.assign({}, state, {
		isLogin: payload.data
	})
}, {
		isApplicationReady: false,
		isLoading: false,
		msg: '',
		structuralList: [],
		countryInfo: [],
		countryPhone: [],
		nationInfo: [],
		visibleData: [],
		countryPhone: [],
		depositSetting: {
			charges: null,
			showCharge: false,
			minDeposit: null,
			maxDeposit: null,
			payList: [],
			exchangeRateSettings: []
		},
		userinfo: {
			email: '',
			language: '',
			lastLoginTime: null,
			phone: '',
			token: '',
			username: '',
			wxname: ''
		},
		selectedAccount: {
			account: null,
			accountName: null,
			accountType: null,
			currency: null,
			logo: null,
			leverage: null,
			serverName: null,
			vendor: null
		},
		brand:{
			companyAddress: "",
			companyEmail: "",
			companyName: "",
			companyPhone: "",
			companySite: "",
			customerDomain: "",
			olCustomerSrv: "",
			productDomain: "",
			productIcon: "",
			productLogo: "",
			mobileLogo:"",
			siteName: "",
			tenantId: "",
			tenantName: "",
			themeId: "",
			tpId: ""
		},
		commonServerNames: [],
		isLogin:null,
	})

function parseDepositSetting(setting) {
	let copy = Object.assign({}, setting);
	if (!copy || !copy.payList) return false 
	let payList = copy.payList.map(o => {
		return {
			"currency": o.currency,
			"value": o.providerId,
			"primaryText": o.name,
			"providerName": o.providerName
		}
	})
	let result = Object.assign({}, copy, { "payList": payList });
	return result;
}
