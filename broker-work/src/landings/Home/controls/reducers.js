import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------

import {
  MODIFY_PARAMS,
  SHOW_VALIDATE_CODE,
  SHOW_LOGIN_ERROR,
  SAVE_VALIDATE_DATA,
  GET_ACCESS_CONFIG
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------

// 登陆的参数
export const loginParams = handleActions(
  {
    [MODIFY_PARAMS]: (satte, { payload }) => payload,
    [SAVE_VALIDATE_DATA]: (state, { payload }) => {
      return {
        ...state,
        neCaptchaDTO: payload
      };
    }
  },
  {
    loginName: '',
    password: '',
    remember: false,
    language: undefined,
    neCaptchaDTO: undefined
  }
);

// 错误提示
export const errorMessage = handleActions(
  {
    [SHOW_LOGIN_ERROR]: (state, { payload }) => payload
  },
  ''
);

// 验证码显示
export const valideCode = handleActions(
  {
    [SHOW_VALIDATE_CODE]: () => true
  },
  false
);

// 验证码显示
export const accessConfig = handleActions(
  {
    [GET_ACCESS_CONFIG]: (state, { payload = {} }) => payload
  },
  {}
);


