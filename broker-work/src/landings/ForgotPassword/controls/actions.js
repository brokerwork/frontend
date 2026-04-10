import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import i18n from 'utils/i18n';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'FORGET_PASSWORD_';
export const SUBMIT = `${PRE_FIX}SUBMIT`;
export const MODIFY_EMAIL = `${PRE_FIX}MODIFY_EMAIL`;
export const SHOW_ERROR_MESSAGE = `${PRE_FIX}SHOW_ERROR_MESSAGE`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 提交
export const submit = createAction(SUBMIT, email => dispatch =>
  post({
    url: `/v1/user/forget/password/${email}/mail`
  }).then(({ data, result, mcode }) => {
    if (!result) {
      // 错误信息显示
      dispatch(showLoginError(mcode));
    } else {
      dispatch(showLoginError());
    }
    return Promise.resolve({
      result: true,
      data: result ? 'ok' : 'fail'
    });
  })
);

// 错误显示
export const showLoginError = createAction(
  SHOW_ERROR_MESSAGE,
  mcode => (mcode ? i18n[mcode] : '')
);

// 修改提交内容
export const modifyEmail = createAction(MODIFY_EMAIL, v => v);
