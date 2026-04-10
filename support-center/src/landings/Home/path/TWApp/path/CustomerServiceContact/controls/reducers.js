import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_DATA
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------


export const defaultData = handleActions({
  [GET_DATA]: (state, { payload }) => payload
}, {});