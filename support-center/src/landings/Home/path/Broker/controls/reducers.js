import { handleActions } from 'redux-actions';
import {languages} from "utils/config";
import _ from 'lodash';
// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_BRAND_INFO,
  GET_PRODUCT_DETAIL,
  GET_PRODUCT_LIMIT,
  GET_ACCESS_SETTING,
  RIGHT_FUNCTION
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------


export const brandInfo = handleActions({
  [GET_BRAND_INFO]: (state, { payload }) => payload
}, {});

export const productDetail = handleActions({
  [GET_PRODUCT_DETAIL]: (state, { payload }) => payload
}, {});

export const productLimit = handleActions({
  [GET_PRODUCT_LIMIT]: (state, { payload }) => payload
}, {});

export const accessSetting = handleActions({
  [GET_ACCESS_SETTING]: (state, { payload }) => {
  	const GoogleAuthenticator = _.get(payload, 'twoFAConfig.types.[0]', '');
  	if (GoogleAuthenticator === 'GoogleAuthenticator') {
  		payload.GoogleAuthenticator = true;
  	}
  	return payload;
  }
}, {});

export const brokerRights = handleActions({
  [RIGHT_FUNCTION]: (state, { payload }) => payload
}, []);
