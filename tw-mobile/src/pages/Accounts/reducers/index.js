import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import { AccountModel } from '../models/account';
import {
	FETCH_ACCOUNTS,
	FETCH_USER_INFO,
	VISIBLE_MODULES
} from '../actions';

function parseAccounts(platforms) {
	var arr = [];
	if (!platforms) return arr 
	platforms.forEach(platform => {
		let logo = platform.logo;
		let serverName = platform.serverName;
		let vendor = platform.vendor;
		let mAccounts = platform.mAccounts || [];
		mAccounts.forEach(o => {
			arr.push(new AccountModel({
				logo: logo,
				account: o.account,
				accountType: o.accountType,
				accountName: o.accountName,
				currency: o.currency,
				leverage: o.leverage,
				serverName: serverName,
				serverId: o.serverId,
				vendor: vendor,
				balance: o.balance,
			}))
		})
	})
	return arr;
}

export let accountsPage = handleActions(
	{
		[FETCH_ACCOUNTS]: function (state, { payload }) {
			return Object.assign({}, state, {
				accounts: parseAccounts(payload.data)
			})
		}
	},
	{
		accounts: []
	}
)
