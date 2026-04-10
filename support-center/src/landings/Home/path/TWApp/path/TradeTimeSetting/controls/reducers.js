import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_VENDOR_INFO,
  GET_TIME_INFO
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------


export const vendorInfo = handleActions({
  [GET_VENDOR_INFO]: (state, { payload }) => payload
}, []);

export const timeInfo = handleActions({
  [GET_TIME_INFO]: (state, { payload }) => payload
}, {});