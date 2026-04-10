import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { MODIFY_PARAMS, SHOW_ERROR_MESSAGE, GET_PASSWORD_REG } from './actions';
// ---------------------------------------------
// reducers
// ---------------------------------------------

export const resetPasswordParams = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => payload
  },
  {}
);

export const passwordReg = handleActions(
  {
    [GET_PASSWORD_REG]: (state, { payload }) => payload
  },
  ''
);

export const errorMessage = handleActions(
  {
    [SHOW_ERROR_MESSAGE]: (state, { payload }) => payload
  },
  ''
);
