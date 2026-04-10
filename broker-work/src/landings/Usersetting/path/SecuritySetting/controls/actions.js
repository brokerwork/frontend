import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'DOUBLE_AUTH_';
export const GET_SETTING = `${PRE_FIX}GET_SETTING`;
export const OPEN_AUTH = `${PRE_FIX}OPEN_AUTH`;
export const CLOSE_AUTH = `${PRE_FIX}CLOSE_AUTH`;
export const GET_GOOGLE_INFO = `${PRE_FIX}GET_GOOGLE_INFO`;
export const GET_AUTH_STATE = `${PRE_FIX}GET_AUTH_STATE`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------
// 获取BW用户2FA开闭
export const getAuthState = createAction(GET_AUTH_STATE, () =>
  get({
    url: '/v1/user/2fa/setting'
  })
);
// 获取BW用户2FA设置
export const getSetting = createAction(GET_SETTING, () =>
  get({
    url: '/v1/user/login/access'
  })
);

// 获取Google验证二维码和秘钥
export const getGoogle = createAction(GET_GOOGLE_INFO, () =>
  get({ url: '/v1/user/2fa/google' })
);

// 开启用户2FA设置
export const openAuth = createAction(OPEN_AUTH, data =>
  post({ url: '/v1/user/2fa/open', data })
);

// 关闭用户2FA设置
export const closeAuth = createAction(OPEN_AUTH, code =>
  post({ url: `/v1/user/2fa/close/${code}` })
);
