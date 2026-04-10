import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_VENDOR_INFO
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------


export const vendorInfo = handleActions({
  [GET_VENDOR_INFO]: (state, { payload }) => payload
}, []);