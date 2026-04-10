// libs
import { createAction } from 'redux-actions';

// utils
import { get, post } from '../../../utils/api'
import { getCachedToken,setCachedToken } from '../../../utils/userinfo';

export const FETCH_PLATFORMS = 'FETCH_PLATFORMS';
export const FETCH_DISCLAIMER = 'FETCH_DISCLAIMER';
export const FETCH_VERIFICATION_CODER = 'FETCH_VERIFICATION_CODER';
export const OPEN_REAL_ACCOUNT = 'OPEN_REAL_ACCOUNT';
export const OPEN_DEMO_ACCOUNT = 'OPEN_DEMO_ACCOUNT';

export const UPDATE_SELECTED_SERVER = "UPDATE_SELECTED_SERVER";
export const UPDATE_SERVER_ERROR_TEXT = "UPDATE_SERVER_ERROR_TEXT";
export const UPDATE_SELECTED_ACCOUNT_TYPE = "UPDATE_SELECTED_ACCOUNT_TYPE";
export const UPDATE_ACCOUNT_TYPE_ERROR_TEXT = "UPDATE_ACCOUNT_TYPE_ERROR_TEXT";
export const UPDATE_SELECTED_DEMO_ACCOUNT_TYPE = "UPDATE_SELECTED_DEMO_ACCOUNT_TYPE";
export const UPDATE_DEMO_ACCOUNT_TYPE_ERROR_TEXT = "UPDATE_DEMO_ACCOUNT_TYPE_ERROR_TEXT";
export const UPDATE_ACCOUNTNAME = "UPDATE_ACCOUNTNAME";
export const UPDATE_ACCOUNTNAME_ERROR_TEXT = "UPDATE_ACCOUNTNAME_ERROR_TEXT";
export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const UPDATE_EMAIL_ERROR_TEXT = "UPDATE_EMAIL_ERROR_TEXT";
export const UPDATE_SELECTED_AREA_CODE = "UPDATE_SELECTED_AREA_CODE";
export const UPDATE_AREA_CODE_ERROR_TEXT = "UPDATE_AREA_CODE_ERROR_TEXT";
export const UPDATE_PHONE = "UPDATE_PHONE";
export const UPDATE_PHONE_ERROR_TEXT = "UPDATE_PHONE_ERROR_TEXT";
export const UPDATE_VERIFY_CODE = 'UPDATE_VERIFY_CODE';
export const UPDATE_VERIFY_CODE_ERROR_TEXT = 'UPDATE_VERIFY_CODE_ERROR_TEXT';
export const UPDATE_LOGIN_PWD = "UPDATE_LOGIN_PWD";
export const UPDATE_LOGIN_PWD_ERROR_TEXT = "UPDATE_LOGIN_PWD_ERROR_TEXT";
export const UPDATE_REPEAT_LOGIN_PWD = "UPDATE_REPEAT_LOGIN_PWD";
export const UPDATE_REPEAT_LOGIN_PWD_ERROR_TEXT = "UPDATE_REPEAT_LOGIN_PWD_ERROR_TEXT";

export const updateSelectedServer = createAction(
	UPDATE_SELECTED_SERVER,
	(selectedServer) => selectedServer
)

export const updateServerErrorText = createAction(
	UPDATE_SERVER_ERROR_TEXT,
	(serverErrorText) => serverErrorText
)

export const updateSelectedAccountType = createAction(
	UPDATE_SELECTED_ACCOUNT_TYPE,
	(selectedAccountType) => selectedAccountType
)

export const updateAccountTypeErrorText = createAction(
	UPDATE_ACCOUNT_TYPE_ERROR_TEXT,
	(accountTypeErrorText) => accountTypeErrorText
)

export const updateAccountName = createAction(
	UPDATE_ACCOUNTNAME,
	(accountName) => accountName
)

export const updateAccountNameErrorText = createAction(
	UPDATE_ACCOUNTNAME_ERROR_TEXT,
	(accountNameErrorText) => accountNameErrorText
)

export const updateSelectedDemoAccountType = createAction(
	UPDATE_SELECTED_DEMO_ACCOUNT_TYPE,
	(demoAccountType) => demoAccountType
)

export const updateDemoAccountTypeErrorText = createAction(
	UPDATE_DEMO_ACCOUNT_TYPE_ERROR_TEXT,
	(demoAccountTypeErrorText) => demoAccountTypeErrorText
)

export const updateEmail = createAction(
	UPDATE_EMAIL,
	(email) => email
)

export const updateEmailErrorText = createAction(
	UPDATE_EMAIL_ERROR_TEXT,
	(emailErrorText) => emailErrorText
)

export const updateSelectedAreaCode = createAction(
	UPDATE_SELECTED_AREA_CODE,
	(selectedAreaCode) => selectedAreaCode
)

export const updateAreaCodeErrorText = createAction(
	UPDATE_AREA_CODE_ERROR_TEXT,
	(areaCodeErrorText) => areaCodeErrorText
)

export const updatePhone = createAction(
	UPDATE_PHONE,
	(phone) => phone
)

export const updatePhoneErrorText = createAction(
	UPDATE_PHONE_ERROR_TEXT,
	(phoneErrorText) => phoneErrorText
)

export const updateVerifyCode = createAction(
	UPDATE_VERIFY_CODE,
	(code) => code
)

export const updateVerifyCodeErrorText = createAction(
	UPDATE_VERIFY_CODE_ERROR_TEXT,
	(errorText) => errorText
);
export const updateLoginPwd = createAction(
	UPDATE_LOGIN_PWD,
	(loginPwd) => loginPwd
)

export const updateLoginPwdErrorText = createAction(
	UPDATE_LOGIN_PWD_ERROR_TEXT,
	(loginPwdErrorText) => loginPwdErrorText
)

export const updateRepeatLoginPwd = createAction(
	UPDATE_REPEAT_LOGIN_PWD,
	(repeatLoginPwd) => repeatLoginPwd
)

export const updateRepeatLoginPwdErrorText = createAction(
	UPDATE_REPEAT_LOGIN_PWD_ERROR_TEXT,
	(repeatLoginPwdErrorText) => repeatLoginPwdErrorText
)

export const fetchPlatforms = createAction(
	FETCH_PLATFORMS,
	() => {
		return get('/v1/mobile/account/open/refer', options);
	}
)

export const openRealAccount = createAction(
	OPEN_REAL_ACCOUNT,
	(params) => {
		let options = {
			data: params
		}
		return post('/v1/wechat/signupopen', options).then(res=>{
			setCachedToken(res.data.token)
			return res;
		});
	},
	() => {
		return {
			transition() {
				return '/accounts';
			}
		}
	}
)

export const openDemoAccount = createAction(
	OPEN_DEMO_ACCOUNT,
	(params) => {
		let options = {
			data: params
		}
		return post('/v1/wechat/signupopen', options).then(res=>{
			setCachedToken(res.data.token)
			return res;
		});
	},
	() => {
		return {
			transition() {
				return '/accounts';
			}
		}
	}
)

export const fetchVerificationCode = createAction(
    FETCH_VERIFICATION_CODER,
    (phone) => {
				return get(`/v1/mobile/phone/code?phone=${phone}&validateType=Register`)
    },
    () => {
        return { skipReducer: true }
    }
);
export const fetchDisclaimer = createAction(
	FETCH_DISCLAIMER,
	(vendor) => {
		return get(`/v1/mobile/disclaimer?vendor=${vendor}`);
	},
	()=>{
		return { skipReducer: true }
	}
)