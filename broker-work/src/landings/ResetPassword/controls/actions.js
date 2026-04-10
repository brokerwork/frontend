import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import i18n from 'utils/i18n';
import regTransfer from 'utils/regTransfer';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'FORGET_PASSWORD_';
export const SUBMIT = `${PRE_FIX}SUBMIT`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const SHOW_ERROR_MESSAGE = `${PRE_FIX}SHOW_ERROR_MESSAGE`;
export const GET_PASSWORD_REG = `${PRE_FIX}GET_PASSWORD_REG`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 提交
export const submit = createAction(SUBMIT, ({ email, ...data }) => dispatch =>
  post({
    url: `/v1/user/reset/password/${email}/mail`,
    data: data
  }).then(({ data, result, mcode }) => {
    if (!result) {
      // 错误信息显示
      dispatch(showError(i18n[mcode]));
    } else {
      dispatch(showError());
    }
    return Promise.resolve({
      result: true,
      data: result ? 'ok' : 'fail'
    });
  })
);

// 错误显示
export const showError = createAction(SHOW_ERROR_MESSAGE, msg => msg || '');

// 提交参数修改
export const modifyParams = createAction(MODIFY_PARAMS, v => v);

export const getPasswordReg = createAction(GET_PASSWORD_REG, () =>
  get({
    url: '/v1/user/login/access'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const { pwdStrength, pwdRegexMap } = res.data;
    const reg = regTransfer(pwdRegexMap, pwdStrength);
    return Promise.resolve({
      ...res,
      data: reg
    });
  })
);
