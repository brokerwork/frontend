import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_SERVER_LIST,
  GET_CURRENT_NO
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------


export const serverList = handleActions({
  [GET_SERVER_LIST]: (state, { payload }) => payload
}, []);

export const currentNo = handleActions({
  [GET_CURRENT_NO]: (state, { payload }) => payload
}, 0);