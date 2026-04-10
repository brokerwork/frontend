import { createAction } from 'redux-actions';
import { post } from 'utils/ajax';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'FORGOT_PASSWORD_';
export const VERIFY = `${PRE_FIX}VERIFY`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const verify = createAction(VERIFY, email =>
  post({
    url: `forget/password/${email}/mail`
  })
);
