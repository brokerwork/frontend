// libs
import {
	handleActions
} from 'redux-actions';
// actions
import {
	FETCH_PLATFORMS,
	OPEN_REAL_ACCOUNT,
	OPEN_DEMO_ACCOUNT,
	UPDATE_SELECTED_SERVER,
	UPDATE_SERVER_ERROR_TEXT,
	UPDATE_SELECTED_ACCOUNT_TYPE,
	UPDATE_ACCOUNT_TYPE_ERROR_TEXT,
	UPDATE_SELECTED_DEMO_ACCOUNT_TYPE,
	UPDATE_DEMO_ACCOUNT_TYPE_ERROR_TEXT,
	UPDATE_ACCOUNTNAME,
	UPDATE_ACCOUNTNAME_ERROR_TEXT,
	UPDATE_EMAIL,
	UPDATE_EMAIL_ERROR_TEXT,
	UPDATE_SELECTED_AREA_CODE,
	UPDATE_AREA_CODE_ERROR_TEXT,
	UPDATE_PHONE,
	UPDATE_PHONE_ERROR_TEXT,
	UPDATE_VERIFY_CODE,
	UPDATE_VERIFY_CODE_ERROR_TEXT,
	UPDATE_LOGIN_PWD,
	UPDATE_LOGIN_PWD_ERROR_TEXT,
	UPDATE_REPEAT_LOGIN_PWD,
	UPDATE_REPEAT_LOGIN_PWD_ERROR_TEXT
} from '../actions/index';

function parseData(data) {

}

export let signupOpenAccountPage = handleActions({

	[UPDATE_SELECTED_SERVER]: (state, { payload }) => {
		return Object.assign({}, state, {
			selectedServer: payload
		});
	},
	[UPDATE_SERVER_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, {
			serverErrorText: payload
		});
	},
	[UPDATE_SELECTED_ACCOUNT_TYPE]: (state, { payload }) => {
		return Object.assign({}, state, {
			selectedAccountType: payload
		});
	},
	[UPDATE_ACCOUNT_TYPE_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, {
			accountTypeErrorText: payload
		});
	},
	[UPDATE_SELECTED_DEMO_ACCOUNT_TYPE]: (state, { payload }) => {
		return Object.assign({}, state, {
			demoAccountType: payload
		});
	},
	[UPDATE_DEMO_ACCOUNT_TYPE_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, {
			demoAccountTypeErrorText: payload
		});
	},
	[UPDATE_ACCOUNTNAME]: (state, { payload }) => {
		return Object.assign({}, state, {
			accountName: payload
		});
	},
	[UPDATE_ACCOUNTNAME_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, {
			accountNameErrorText: payload
		});
	},
	[UPDATE_EMAIL]: (state, { payload }) => {
		return Object.assign({}, state, {
			email: payload
		});
	},
	[UPDATE_EMAIL_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, {
			emailErrorText: payload
		});
	},
	[UPDATE_SELECTED_AREA_CODE]: (state, { payload }) => {
		return Object.assign({}, state, {
			selectedAreaCode: payload
		});
	},
	[UPDATE_AREA_CODE_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, {
			areaCodeErrorText: payload
		});
	},
	[UPDATE_PHONE]: (state, { payload }) => {
		return Object.assign({}, state, {
			phone: payload
		});
	},
	[UPDATE_PHONE_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, {
			phoneErrorText: payload
		});
	},
	[UPDATE_VERIFY_CODE]: (state, { payload }) => {
		return Object.assign({}, state, {
			verifyCode: payload
		})
	},
	[UPDATE_VERIFY_CODE_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, {
			verifyCodeErrorText: payload
		})
	},
	[UPDATE_LOGIN_PWD]: (state, { payload }) => {
		return Object.assign({}, state, {
			loginPwd: payload
		});
	},
	[UPDATE_LOGIN_PWD_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, {
			loginPwdErrorText: payload
		});
	},
	[UPDATE_REPEAT_LOGIN_PWD]: (state, { payload }) => {
		return Object.assign({}, state, {
			repeatLoginPwd: payload
		});
	},
	[UPDATE_REPEAT_LOGIN_PWD_ERROR_TEXT]: (state, { payload }) => {
		return Object.assign({}, state, {
			repeatLoginPwdErrorText: payload
		});
	},
	[FETCH_PLATFORMS]: (state, action) => {
		// let serverNames = [];
		// let demoAccountTypes = {};
		// serverNames = action.payload.data.map((value, index) => {
		// 	demoAccountTypes[value.serverName] = value.demoAccountTypes;
		// 	return value.serverName;
		// })
		// return Object.assign({}, state, {
		// 	serverNames: serverNames,
		// 	demoAccountTypes: demoAccountTypes
		// });

		return Object.assign({}, state, {
			platforms: action.payload.data || []
		})
	},
	[OPEN_REAL_ACCOUNT]: (state, action) => {
		return Object.assign({}, state, {
			realAccount: action.payload.data
		})
	},
	[OPEN_DEMO_ACCOUNT]: (state, action) => {
		return Object.assign({}, state, {
			demoAccount: action.payload.data
		})
	}
}, {
		platforms: [],
		serverNames: [], // array of string
		demoAccountTypes: {}, //map of {serverName, typeArray}
		hasConfirmBoxChecked: false,
		selectedServer: '',
		serverErrorText: null,
		selectedAccountType: '',
		accountTypeErrorText: null,
		demoAccountType: '',
		demoAccountTypeErrorText: '',
		accountName: '',
		accountNameErrorText: null,
		email: '',
		emailErrorText: '',
		selectedAreaCode: '+86',
		areaCodeErrorText: null,
		phone: '',
		phoneErrorText: '',
		verifyCode: '',
		verifyCodeErrorText: '',
		loginPwd: '',
		loginPwdErrorText: null,
		repeatLoginPwd: '',
		repeatLoginPwdErrorText: null,
		disclaimer: ''
	});