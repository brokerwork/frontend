import { createAction } from 'redux-actions';
import { post, get } from 'utils/api'
import { UserInfo, getCachedToken } from 'utils/userinfo';
import { Storage } from 'utils/storage'

const PRE_FIX = 'WITHDRAW_ACTIONS_';
export const GET_BANK_LIST = `${PRE_FIX}GET_BANK_LIST`;
export const GET_ACCOUNT_WITHDRAW_INFO = `${PRE_FIX}GET_ACCOUNT_WITHDRAW_INFO`;
export const POST_WITHDRAW_APPLY = `${PRE_FIX}POST_WITHDRAW_APPLY`;
export const GET_BANK_INFO = `${PRE_FIX}GET_BANK_INFO`;
export const GET_AMOUNT = 'GET_AMOUNT'

export const getBankList = createAction(
    GET_BANK_LIST,
    () => {
		return get('/api/v1/ops/tenants/metadata/field/option/bankAccount')
	}
)

export const getBankInfo = createAction(
    GET_BANK_INFO,
    () => {
		return get('/v1/mobile/userdetail/bank/accounts')
	}
)

export const getAccountWithDrawInfo = createAction(
    GET_ACCOUNT_WITHDRAW_INFO,
    (vendor) => {
		return get(`/v1/mobile/withdrawSetting?vendor=${vendor}`)
	}
)

export const postWithdrawApply = createAction(
    POST_WITHDRAW_APPLY,
    (data) => {
		return post('/v1/mobile/fund/withdraw',{
			headers: {
				'x-api-account-token': Storage.getString(Storage.Keys.ACCOUNT_TOKEN)
			},
			data: data
		})
	}
)

export const getAmount = createAction(
	GET_AMOUNT,
	() => { 
		return get('/api/v1/fund/current/max/withdraw/amount', {
			headers: {
				'x-api-account-token': Storage.getString(Storage.Keys.ACCOUNT_TOKEN)
			}
		})
	}
)

