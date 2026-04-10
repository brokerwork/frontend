import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_BRAND_INFO,
  GET_DATA,
  MODIFY_DISCLAIMER,
  MODIFY_ABOUT_US,
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------


export const brandInfo = handleActions({
  [GET_BRAND_INFO]: (state, { payload }) => payload
}, []);

export const disclaimer = handleActions({
  [GET_DATA]: (state, { payload }) => payload.disclaimer || '',
  [MODIFY_DISCLAIMER]: (state, { payload }) => payload
}, '');

export const aboutus = handleActions({
  [GET_DATA]: (state, { payload }) => payload.aboutUs || '',
  [MODIFY_ABOUT_US]: (state, { payload }) => payload
}, '');