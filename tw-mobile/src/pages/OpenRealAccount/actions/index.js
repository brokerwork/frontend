// libs
import { createAction } from 'redux-actions';
// utils
import { post, get } from 'utils/api'
import { UserInfo, getCachedToken } from 'utils/userinfo';
import {fetchDisclaimer as fetchAccountDisclaimer} from '../../SignupOpenAccount/actions';
/* ------------- main ------------------ */

// 后缀 ORAF = open real account form
export const UPDATE_ACCOUNT_NAME_ORAF = 'UPDATE_ACCOUNT_NAME_ORAF';
export const UPDATE_EMAIL_ORAF = 'UPDATE_EMAIL_ORAF';
export const UPDATE_PHONE_ORAF = 'UPDATE_PHONE_ORAF';
export const FETCH_SERVER_NAME_ORAF = 'FETCH_SERVER_NAME_ORAF';
export const UPDATE_SERVER_NAME_ORAF = 'UPDATE_SERVER_NAME_ORAF';
export const TOGGLE_AGREEMENT_CHECKED_FLAG_ORAF = 'TOGGLE_AGREEMENT_CHECKED_FLAG_ORAF';
export const FETCH_USER_ACCOUNT_PROFILE = 'FETCH_USER_ACCOUNT_PROFILE';
export const SHOW_CONFIRMATION_ORAF = 'SHOW_CONFIRMATION_ORAF';
export const HIDE_CONFIRMATION_ORAF = 'HIDE_CONFIRMATION_ORAF';
export const SUBMIT_OPEN_ACCOUNT_REQUEST_ORAF = 'SUBMIT_OPEN_ACCOUNT_REQUEST_ORAF';
// export const FETCH_BRAND_LOGO_ORAF = 'FETCH_BRAND_LOGO_ORAF';
export const MARK_INVALID_FORM_FIELDS_ORAF = 'MARK_INVALID_FORM_FIELDS_ORAF';
export const RESET_FORM_ORAF = 'RESET_FORM_ORAF';

export const updateAccountName = createAction(
  UPDATE_ACCOUNT_NAME_ORAF,
  (accountName) => accountName
)

export const updateEmail = createAction(
  UPDATE_EMAIL_ORAF,
  (email) => email
)

export const updatePhone = createAction( UPDATE_PHONE_ORAF, phone=>phone );

export const fetchServerName = createAction( FETCH_SERVER_NAME_ORAF, function(){
    return get('/v1/mobile/account/open/refer')
} )

export const updateServerName = createAction(
  UPDATE_SERVER_NAME_ORAF,
  ({serverName, vendor}) => ({serverName, vendor})
)

export const toggleAgreementCheckedFlag = createAction( TOGGLE_AGREEMENT_CHECKED_FLAG_ORAF )

export const fetchUserAccountProfile = createAction( FETCH_USER_ACCOUNT_PROFILE, function() {
  return get( '/v1/mobile/account/owner/info')
} )

export const showConfirmation = createAction( SHOW_CONFIRMATION_ORAF );

export const hideConfirmation = createAction( HIDE_CONFIRMATION_ORAF );

export const submitOpenAccountRequest = createAction( SUBMIT_OPEN_ACCOUNT_REQUEST_ORAF, function(params) {
  return post( '/v1/mobile/account/open/real', {
    data: params
  } )
})

// export const fetchBrandLogo = createAction( FETCH_BRAND_LOGO_ORAF, function(){
//   return get('/v1/ops/product/conf/brand?productId=TW', {
//     headers: {
//       'x-api-token': getCachedToken()
//     }
//   });
// } );

export const markInvalidFormFields = createAction( MARK_INVALID_FORM_FIELDS_ORAF );

export const resetForm = createAction( RESET_FORM_ORAF );

export const fetchDisclaimer = fetchAccountDisclaimer;

