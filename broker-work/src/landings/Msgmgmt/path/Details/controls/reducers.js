import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------

import { GET_MESSAGE_DETAILS } from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------
export const details = handleActions(
  {
    [GET_MESSAGE_DETAILS]: (state, { payload }) => payload
  },
  {}
);
