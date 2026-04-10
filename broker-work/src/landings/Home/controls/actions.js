import { createAction } from 'redux-actions';
import { getType as getLangType } from 'utils/language';
import { get, post } from 'utils/ajax';
import { saveToken } from 'utils/userInfo';
import i18n from 'utils/i18n';
import { updateSessionStorage } from 'utils/sessionStorageShare';
import { createAESKey } from 'utils/encryption';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'LOGIN_';
export const SUBMIT = `${PRE_FIX}SUBMIT`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const GET_PASSWORD_REGEX = `${PRE_FIX}GET_PASSWORD_REGEX`;
export const GET_ACCESS_CONFIG = `${PRE_FIX}GET_ACCESS_CONFIG`;
export const SHOW_LOGIN_ERROR = `${PRE_FIX}SHOW_LOGIN_ERROR`;
export const SHOW_VALIDATE_CODE = `${PRE_FIX}SHOW_VALIDATE_CODE`;
export const SAVE_VALIDATE_DATA = `${PRE_FIX}SAVE_VALIDATE_DATA`;
export const VERIFY_AUTH_CODE = `${PRE_FIX}VERIFY_AUTH_CODE`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 错误显示
export const showLoginError = createAction(SHOW_LOGIN_ERROR, msg => msg || '');

// 验证码刷新时, 直接用已有实例调用刷新方法
// 不可以再次重新初始化
let captchaObj;

// 极验, 验证结果保存
export const saveValidateData = createAction(SAVE_VALIDATE_DATA, data => data);

// 验证码显示
export const showValidateCode = createAction(
  SHOW_VALIDATE_CODE,
  valideCode => dispatch => {
    const captchaId = '0c2058677d4149e48181fb30a8b639ac';
    if (captchaObj) {
      captchaObj.refresh();
      return Promise.resolve({
        result: true
      });
    }

    if (valideCode) return;

    dispatch({ type: SHOW_VALIDATE_CODE });

    let lang = getLangType();
    if (lang !== 'zh-CN' && lang !== 'zh-CN') {
      lang = lang.split('-').shift();
    }
    console.log('lang', lang);
    initNECaptcha(
      {
        // config对象，参数配置
        captchaId,
        element: '#gt',
        mode: 'float',
        width: 'auto',
        lang,
        onVerify: (err, data) => {
          if (err) {
            dispatch(saveValidateData());
          } else {
            dispatch(
              saveValidateData({
                ...data,
                captchaId
              })
            );
          }
        }
      },
      instance => {
        // 初始化成功后得到验证实例instance，可以调用实例的方法
        captchaObj = instance;
      },
      err => {
        // 初始化失败后触发该函数，err对象描述当前错误信息
      }
    );

    return Promise.resolve({
      result: true
    });
  }
);

// 提交
export const submit = createAction(SUBMIT, (params, valideCode) => dispatch => {
  updateSessionStorage();
  const lang = getLangType();
  console.log({
    ...params,
    lang,
    key: createAESKey()
  });
  return post({
    url: '/v1/user/login',
    data: {
      ...params,
      lang,
      key: createAESKey()
    }
  }).then(({ data, result, mcode }) => {
    if (!result) {
      // 错误信息显示
      dispatch(showLoginError(i18n[mcode]));
      // 传空值, 清空验证码
      dispatch(saveValidateData());
      // 显示验证码
      if (data && data.loginFailTimes >= data.showValidateCodeTimes) {
        dispatch(showValidateCode(valideCode));
      }
    } else {
      saveToken(data.token);
      dispatch(showLoginError());
    }
    return Promise.resolve({
      result: true,
      data: {
        state: result ? 'ok' : 'fail',
        frontVersion: result ? data.frontVersion : '',
        oldFrontVersion: result ? data.oldFrontVersion : '',
        uiVersion: result ? data.uiVersion : null,
        lastLoginIp: result ? data.lastLoginIp : '',
        isSameLastLoginIp: result ? data.isSameLastLoginIp : ''
      }
    });
  });
});

// 修改提交内容
export const modifyParams = createAction(MODIFY_PARAMS, params => params);

// 获取2次验证配置
export const getAccessConfig = createAction(GET_ACCESS_CONFIG, () =>
  get({
    url: '/v1/user/2fa/setting'
  })
);

// 验证验证码
export const verifyAuthCode = createAction(VERIFY_AUTH_CODE, data =>
  post({
    url: '/v1/user/2fa/verify',
    data
  })
);
