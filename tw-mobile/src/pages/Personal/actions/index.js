import {createAction} from 'redux-actions';
import { get, post } from 'utils/api'
import { getCachedToken } from 'utils/userinfo';

export const FETCH_PERSONAL_INFO = 'FETCH_PERSONAL_INFO';
export const LOGOUT = 'LOGOUT'

export const fetchPersonalInfo = createAction(
	FETCH_PERSONAL_INFO,
	()=>{
		return get('/v1/wechat/user')
	}
)

export const logout = createAction(
	LOGOUT,
	() => { 
		let token = getCachedToken()
		return post(`/api/v1/user/logout?apiToken=${token}`)
	}
)