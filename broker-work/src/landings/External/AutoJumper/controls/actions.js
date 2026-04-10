import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { updateSessionStorage } from 'utils/sessionStorageShare';
import { createAESKey } from 'utils/encryption';
import { saveToken } from 'utils/userInfo';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'AUTO_JUMPER_';
export const LOGIN = `${PRE_FIX}LOGIN`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 提交
export const login = createAction(LOGIN, params => dispatch => {
  updateSessionStorage();
  return post({
    url: '/v1/user/login',
    data: {
      ...params,
      key: createAESKey()
    }
  }).then(({ data, result }) => {
    if (result) {
      saveToken(data.token);
    }
    return Promise.resolve({
      result: true,
      data: result ? 'ok' : 'fail'
    });
  });
});
