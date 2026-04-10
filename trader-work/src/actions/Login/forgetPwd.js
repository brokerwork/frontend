import { createAction } from 'redux-actions'

import api from '@/api'


export const CHANGEMOBILE = 'CHANGEMOBILE'
export const FETCHCODE = 'FETCHCODE'
export const RESETPWD = 'RESETPWD'
export const RESETPWDFOREMAIL = 'RESETPWDFOREMAIL'
const RESETPWDURL = 'RESETPWDURL'

export const changeMobile =(value)=>{
  return {
    type: CHANGEMOBILE,
    payload: {
      value: value
    }
  }
}

export const fetchCode =createAction(
  FETCHCODE,
  (phone, countryCode, isCaptcha, captchaData) => { 
    if(isCaptcha){//需要滑动验证的找回密码（短信验证码）
        return api.post(`/v2/user/phone/template?phone=${phone}&countryCode=${countryCode}&validateType=ResetPassword`, captchaData)
    }else{
        return api.get(`/v1/user/phone/captcha/template?phone=${phone}&countryCode=${countryCode}&validateType=ResetPassword`)
    }
  }
)

export const resetPwd =createAction(
  RESETPWD,
  (data) => {
    return api.get(`/v1/user/phone/verify`,data)
  }
)

export const resetPwdForEmail =createAction(
  RESETPWDFOREMAIL,
  (data) => {
    return api.post(`/v1/user/forget/password/${data}/mail`)
  }
)
export const changePwd =createAction(
  RESETPWDURL,
  (type,data) => {
    if(type){
      return api.post('/v2/user/reset/password/email',data)
    }else{
      return api.post('/v2/user/reset/password/phone',data)
    }
    
  }
)


