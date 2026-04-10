import { isFSA } from 'flux-standard-action'
import Message from '@/components/Message'
import i18n from 'utils/i18n'
import { ACCOUNT_DATA, ACCOUNT_TOKEN } from '@/utils/storage'
import {auth} from '@/actions/App/app'

function isPromise(val) {
	return val && typeof val.then === 'function'
}

export default function promiseMiddleware({ dispatch }) {
	return next => action => {
		if (!isFSA(action)) {
			return isPromise(action) ? action.then(dispatch) : next(action)
		}
		const promise = action.payload
		if (!isPromise(promise)) return next(action);
		promise.then(res => {
			if (res.result) {
				return next({ ...action, payload: res.data })
			} else if(res.mcode) {
				const i18nMsg = i18n.mcode(res.mcode)
				if (res.mcode == "PUB_AUTH_0000018") {
					Message['error'](i18nMsg)
					setTimeout(() => window.location.href = "/login", 1000)
				} else if(res.mcode == "TA_ACCOUNT0000014"){
					try {
						const account_data = JSON.parse(window.localStorage.getItem(ACCOUNT_DATA))
						auth(account_data.currAccount).then(res => {
							if (res.result) {
								window.location.reload()
							}
							return Promise.resolve(res)
						})
					} catch (error) {
						Message['error'](i18nMsg)
						window.localStorage.removeItem(ACCOUNT_DATA)
						window.localStorage.removeItem(ACCOUNT_TOKEN)
						setTimeout(() => window.location.href = "/personal/overview", 800)
					}
				}else {
					return next({ ...action, payload: i18nMsg, error: true })
				}
			}
		})
		// .catch(error => {
		//   throw new Error(error)
		//   return next({ ...action, payload: error, error: true  })
		//   // 不直接抛出错误，通过error middleware 处理错误
		// })

		return promise
	}
}