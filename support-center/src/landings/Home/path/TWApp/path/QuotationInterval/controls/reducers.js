import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_INTERVAL_INFO,
  GET_VENDOR_INFO,
  GET_SERVER_INFO
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------


export const intervalInfo = handleActions({
  [GET_INTERVAL_INFO]: (state, { payload }) => payload
}, []);

export const vendorInfo = handleActions({
  [GET_VENDOR_INFO]: (state, { payload }) => payload
}, []);

export const serverInfo = handleActions({
  [GET_SERVER_INFO]: (state, { payload }) => payload
}, {});