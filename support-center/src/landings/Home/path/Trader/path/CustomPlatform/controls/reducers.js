import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { GET_LIST } from './actions';

export const list = handleActions(
  {
    [GET_LIST]: (state, { payload }) => payload
  },
  []
);
