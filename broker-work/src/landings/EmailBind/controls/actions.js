import { createAction } from 'redux-actions';
import { post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'EMAIL_BIND_';
export const GET_EMAIL_STATE = `${PRE_FIX}GET_EMAIL_STATE`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 提交
export const getEmailState = createAction(
  GET_EMAIL_STATE,
  ({ email, ticket }) =>
    post({
      url: `/v1/user/bind/${email}/mail/${ticket}`
    }).then(res => {
      return Promise.resolve({
        ...res,
        data: res.result,
        result: true
      });
    })
);
