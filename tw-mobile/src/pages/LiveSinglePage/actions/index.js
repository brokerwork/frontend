import { createAction } from 'redux-actions'
import api from 'utils/api'
import { UserInfo, getCachedToken } from 'utils/userinfo'

export const FETCH_LIVE_DETAIL = 'FETCH_LIVE_DETAIL'
export const FETCH_LIVE_DETAIL_BY_VISIT = 'FETCH_LIVE_DETAIL_BY_VISIT'
export const FETCH_LIVE_COMMENT_LIST = 'FETCH_LIVE_COMMENT_LIST'
export const ADD_LIVE_COMMENT = 'ADD_LIVE_COMMENT'
export const FETCH_LIVE_USER_INFO = 'FETCH_LIVE_USER_INFO'
export const REGISTER_BY_PHONE = 'REGISTER_BY_PHONE'
export const LIVE_TOKEN_REFRESH = 'LIVE_TOKEN_REFRESH'
// 获取直播详情-已登录用户
export const fetchLiveDetail = createAction(
	FETCH_LIVE_DETAIL,
	(id) => {
		return api.get(`/api/v1/video/live?id=${id}`,{
			headers: {
				'x-api-token': getCachedToken()
			}
		})
	}
)
// 获取直播详情-游客
export const fetchLiveDetailByVisit = createAction(
	FETCH_LIVE_DETAIL_BY_VISIT,
	(id) => {
		return api.get(`/api/v1/live/nologin/info?roomId=${id}`)
	}
)
// 获取弹幕列表
export const fetchLiveCommentList = createAction(
	FETCH_LIVE_COMMENT_LIST,
	data => api.get("/api/v1/video/comment/list",{data}).then(res=>Promise.resolve(res)),
	() => ({noMask:true})
)
// 发送弹幕
export const addLiveComment = createAction(
	ADD_LIVE_COMMENT,
	data => {
		return api.post("/api/v1/video/comment",{data})
	}
)
// 获取用户状态，禁言、管理员等
export const fetchLiveUserInfo = createAction(
	FETCH_LIVE_USER_INFO,
	data => {
		return api.get("/api/v1/video/user_info",{data})
	}
)
// 发送手机验证码
export const phoneValidate = createAction(
	REGISTER_BY_PHONE,
	(phone, countryCode) => api.get(`/api/v1/user/phone/captcha/template?phone=${phone}&countryCode=${countryCode}&validateType=Register`)
)
// 手机号注册用户
export const registerByPhone = createAction(
	REGISTER_BY_PHONE,
	data => api.post("/api/v1/user/register/phone",{data})
)
// 直播中刷新用户token
export const tokenRefresh = createAction(
	LIVE_TOKEN_REFRESH,
	data => api.get("/api/v1/user/token/refresh")
)