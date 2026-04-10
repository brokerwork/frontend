import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { MODIFY_EMAIL, SHOW_ERROR_MESSAGE } from './actions';
// ---------------------------------------------
// reducers
// ---------------------------------------------

export const email = handleActions(
  {
    [MODIFY_EMAIL]: (state, { payload }) => payload
  },
  ''
);

export const errorMessage = handleActions(
  {
    [SHOW_ERROR_MESSAGE]: (state, { payload }) => payload
  },
  ''
);
