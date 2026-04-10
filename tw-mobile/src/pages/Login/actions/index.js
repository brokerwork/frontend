import { createAction } from 'redux-actions';
import { get, post } from 'utils/api'
import { UserInfo, setCachedToken, setCachedUserInfo, getCachedToken } from 'utils/userinfo';
export const GET_BIND_WEIXIN_TMPKEY = 'GET_BIND_WEIXIN_TMPKEY';

export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const UPDATE_EMAIL_PWD = 'UPDATE_EMAIL_PWD';
export const UPDATE_EMAIL_ERROR_TEXT = 'UPDATE_EMAIL_ERROR_TEXT';
export const UPDATE_EMAIL_PWD__ERROR_TEXT = 'UPDATE_EMAIL_PWD__ERROR_TEXT';

export const UPDATE_PHONE = 'UPDATE_PHONE';
export const UPDATE_PHONE_PWD = 'UPDATE_PHONE_PWD';
export const UPDATE_PHONE_ERROR_TEXT = 'UPDATE_PHONE_ERROR_TEXT';
export const UPDATE_PHONE_PWD__ERROR_TEXT = 'UPDATE_PHONE_PWD__ERROR_TEXT';

export const updateEmail = createAction(
	UPDATE_EMAIL,
	(email) => email
)

export const updateEmailPwd = createAction(
	UPDATE_EMAIL_PWD,
	(emailPwd) => emailPwd
)

export const updateEmailErrorText = createAction(
	UPDATE_EMAIL_ERROR_TEXT,
	(emailErrorText) => emailErrorText
)

export const updateEmailPwdErrorText = createAction(
	UPDATE_EMAIL_PWD__ERROR_TEXT,
	(emailPwdErrorText) => emailPwdErrorText
)

export const updatePhone = createAction(
	UPDATE_PHONE,
	(phone) => phone
)

export const updatePhonePwd = createAction(
	UPDATE_PHONE_PWD,
	(phonePwd) => phonePwd
)

export const updatePhoneErrorText = createAction(
	UPDATE_PHONE_ERROR_TEXT,
	(phoneErrorText) => phoneErrorText
)

export const updatePhonePwdErrorText = createAction(
	UPDATE_PHONE_PWD__ERROR_TEXT,
	(phonePwdErrorText) => phonePwdErrorText
)

export const getBindWeixinTmpKey = createAction(
	GET_BIND_WEIXIN_TMPKEY,
	(username, pwd) => {
		let GlobalVar = window.GlobalVar;
		let { appId, appNo } = GlobalVar;
		return post('/v1/wechat/user/login/key', {
			headers: {
				'x-wx-appid': appId,
				'x-wx-appno': appNo
			},
			data: {
				loginName: username,
				password: pwd
			}
		})
	},
	() => {
		return { skipReducer: true }
	}
)

export const doLogin = (countryCode, username, password) => {
	let data = {
		loginName: username,
		password: password,
	}
	if (countryCode){ 
		data = Object.assign({ countryCode: `+${countryCode}` }, data)
	}
	
	return post('/v1/wechat/user/login', {
		data: data
	}).then(rs => {
		let userinfo = new UserInfo(rs.data);
		setCachedToken(userinfo.token);
		setCachedUserInfo(userinfo);
		return rs;
	})
}