import { createAction } from 'redux-actions';
import { getCachedToken } from 'utils/userinfo';

import { get, post } from '../../../utils/api'

export const FETCH_ACCOUNTS = 'FETCH_ACCOUNTS';
export const FETCH_ACCOUNTS_DONE = 'FETCH_ACCOUNTS_DONE';
export const FETCH_ACCOUNT_TOKEN = 'FETCH_ACCOUNT_TOKEN';
export const FETCH_USER_INFO = 'FETCH_USER_INFO';
export const VISIBLE_MODULES = 'VISIBLE_MODULES'
export const FAST_OPEN_ABLE = 'FAST_OPEN_ABLE'

export const fetchAccounts = createAction(
	FETCH_ACCOUNTS,
	() => {
		return get('/v1/mobile/account/accounts')
	}
)
export const fetchUserInfo = createAction(
	FETCH_USER_INFO,
	() => {
		return get('/v1/wechat/user');
	},
	() => {
		return { skipReducer: true }
	}
)

// promise objects
export const fetchAccountToken = createAction(
	FETCH_ACCOUNT_TOKEN,
	(acct) => {
		let options = {
			data: { 
				"account": acct.account, 
				"serverId": acct.serverId, 
				"tenantId": window.GlobalVar.tenantId,
				"vendor": acct.vendor
			}
		}
		return post('/v1/mobile/account/auth', options)
	}
)
// promise objects
export const getDepositConfig = (vendor) => {
	return get(`/v1/mobile/depositSetting?vendor=${vendor}`)
}

//	获取是否快速开户、常规开户
export const fastOpenAble = createAction(
	FAST_OPEN_ABLE,
	(vendor) => { 
		return get(`/v1/mobile/account/real/fast/openable?vendor=${vendor}`)
	}
)