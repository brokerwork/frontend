import api from '@/api'
import { createAction } from 'redux-actions'

export const FORGOTPWD_STATUS = 'FORGOTPWD_STATUS'
export const FORGOTPWD_RESETPWD = 'FORGOTPWD_RESETPWD'

// 获取当前忘记密码的状态（是否为审核中）
export const getForgotState = createAction(
    FORGOTPWD_STATUS,
    () => api.get('/v1/account/apply/reset/password/status')
)
// 申请重置密码
export const resetPwd = createAction(
    FORGOTPWD_RESETPWD,
    (isLive,userInfo) => {
		if(isLive){
			return api.post('/v1/account/apply/reset/password',userInfo)
		}else{
			return api.post('/v1/account/demo/forget/password',userInfo)
		}
	}
)

