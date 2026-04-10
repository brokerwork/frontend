import { createAction } from 'redux-actions'

import api from '@/api'

export const LOGIN_REGISTER_MAIL_PHONE = 'LOGIN_REGISTER_MAIL_PHONE'
export const LOGIN_PHONE_VALIDATE = 'LOGIN_PHONE_VALIDATE'
export const LOGIN_INVIT_EMAIL = 'LOGIN_INVIT_EMAIL'

//  推荐邮箱注册
export const invitRegisterEmail = createAction(
    LOGIN_INVIT_EMAIL,
    (regData) => { 
        return api.post('/v2/user/email/register/invitation/login', regData)
    }
)

//  邮箱注册
export const registerMail = createAction(
    LOGIN_REGISTER_MAIL_PHONE,
    data => api.post('/v2/user/email/register/login', data)
)

//  手机注册
export const registerPhone = createAction(
    LOGIN_REGISTER_MAIL_PHONE,
    data => api.post('/v2/user/phone/register/login', data)
)

//  手机获取验证码
export const phoneValidate = createAction(
    LOGIN_PHONE_VALIDATE,
    (phone, countryCode, isCaptcha, captchaData) => { 
        if (isCaptcha) {//需要滑动验证的注册
            return api.post(`/v2/user/phone/template?phone=${phone}&countryCode=${countryCode}&validateType=Register`, captchaData)
        }else{
            return api.get(`/v1/user/phone/captcha/template?phone=${phone}&countryCode=${countryCode}&validateType=Register`)
        }
    }
)

//  手机邮箱验证码
export const emailValidate = createAction(
    LOGIN_PHONE_VALIDATE,
    (email, captchaData) => api.post(`/v2/user/email/template?email=${email}&validateType=Register`, captchaData)
)