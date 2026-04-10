import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
	FETCH_OPEN_ACCOUNTS_INFO,
	OPEN_MOCK_ACCOUNT,
	UPDATE_SERVER_NAME,
	UPDATE_ACCOUNT_NAME,
	UPDATE_EMAIL,
	UPDATE_ACCOUNT_TYPE,
	SET_FIELD_ERROR_TEXT,
} from '../actions';

export const openDemoAccountPage = handleActions({
	[FETCH_OPEN_ACCOUNTS_INFO]: (state, action) => {
		let json = parse(action.payload);
		return Object.assign({}, state, json);
	},
	[OPEN_MOCK_ACCOUNT]: (state, { payload }) => {
		let newAccount = payload.data.account;
		let newAccountPassword = payload.data.password;
		let newAccountInvestorPassword = payload.data.investorPassword;
		return Object.assign({}, state, { newAccount, newAccountPassword, newAccountInvestorPassword })
	},
	[UPDATE_SERVER_NAME]: (state, { payload }) => {
		return Object.assign({}, state, { selectedServer: payload });
	},
	[UPDATE_ACCOUNT_NAME]: (state, { payload }) => {
		console.log('mock')
		return Object.assign({}, state, { accountName: payload });
	},
	[UPDATE_EMAIL]: (state, { payload }) => {
		return Object.assign({}, state, { email: payload });
	},
	[UPDATE_ACCOUNT_TYPE]: (state, { payload }) => {
		return Object.assign({}, state, { selectedAccountType: payload });
	},
	[SET_FIELD_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, { [payload.key]: payload.value })
	}
}, {
		serverData: [],	
		serverNames: [],
		serverNamesValidateErrorText: '',
		selectedServer: { serverName: '', vendor: '' },
		accountName: '',
		accountNameValidateErrorText: '',
		email: '',
		emailValidateErrorText: '',
		accountTypes: [],
		accountTypesValidateErrorText: '',
		selectedAccountType: { typeId: '', typeName: '' },
		newAccount: '',
		newAccountPassword: '',
		newAccountInvestorPassword: '',
	})

function parse(refer) {
	let serverData = refer.data
	let serverNames = refer.data.map(o => {
		return { serverName: o.serverName, vendor: o.vendor }
	})
	return { serverData, serverNames }
}