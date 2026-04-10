import { createAction } from 'redux-actions';
import { post, get } from '../../../utils/api';
import { getCachedToken } from 'utils/userinfo';

export const BINDING_EMAIL = 'BINDING_EMAIL';
export const BINDING_PHONE = 'BINDING_PHONE';
export const VERIFICATION_CODE = 'VERIFICATION_CODE';

export const fetchVerificationCode = createAction(VERIFICATION_CODE,
    (phone) => {
        let url = `/api/v1/user/phone/captcha/template?phone=${phone}&validateType=Register`;
        return get(url);
    },
    () => {
        return { skipReducer: true }
    });

export const bindEmail = createAction(
    BINDING_EMAIL,
    (params) => {
        let url = '/v1/wechat/bind/email';
        let options = {
            data: params,
            headers: {
                'x-api-token': getCachedToken()
            }
        }
        return post(url, options);
    },
    () => {
        return { skipReducer: true }
    }
)
export const bindPhone = createAction(
    BINDING_PHONE,
    (params) => {
        let url = '/v1/wechat/bind/phone';
        let options = {
            data: params,
            headers: {
                'x-api-token': getCachedToken()
            }
        };
        return post(url, options);
    },
    () => {
        return { skipReducer: true }
    }
)
