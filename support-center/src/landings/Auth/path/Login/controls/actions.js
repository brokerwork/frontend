import { createAction } from 'redux-actions';
import { post } from 'utils/ajax';
import { saveToken, saveUserInfo } from 'utils/userInfo';
import { saveTenantId } from 'utils/tenantInfo';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'LOGIN_';
export const LOGIN = `${PRE_FIX}LOGIN`;


// ---------------------------------------------
// action creaters
// ---------------------------------------------


export const login = createAction(
  LOGIN,
  (info) => {
    return post({
      url: '/v1/pub/auth/login/captcha',
      data: info
    }).then((res) => {
      if (res.result) {
        saveToken(res.data.token);
        saveTenantId(res.data.username);
        saveUserInfo(res.data);
      }

      return Promise.resolve(res);
    });
  }
);