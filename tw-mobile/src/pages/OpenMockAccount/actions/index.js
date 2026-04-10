import { createAction } from 'redux-actions';
import { post, get } from 'utils/api'
import {UserInfo, getCachedToken} from 'utils/userinfo';

export const FETCH_OPEN_ACCOUNTS_INFO = 'FETCH_OPEN_ACCOUNTS_INFO';
export const OPEN_MOCK_ACCOUNT = 'OPEN_MOCK_ACCOUNT';
export const UPDATE_SERVER_NAME = 'UPDATE_SERVER_NAME';
export const UPDATE_ACCOUNT_NAME = 'UPDATE_ACCOUNT_NAME';
export const UPDATE_EMAIL = 'UPDATE_EMAIL';
export const UPDATE_ACCOUNT_TYPE = 'UPDATE_ACCOUNT_TYPE';
export const SET_FIELD_ERROR_TEXT = 'SET_FIELD_ERROR_TEXT';

export const setFieldErrorText = createAction(
	SET_FIELD_ERROR_TEXT,
	(fieldKey, errorText) => {
		return {key: fieldKey, value: errorText}
	}
)
export const fetchOpenAccountsInfo = createAction(FETCH_OPEN_ACCOUNTS_INFO, () => {

  let fetchDemoAccountsInfo = get('/v1/mobile/account/open/refer')
  return Promise.all([fetchDemoAccountsInfo]).then(results => {
    let refer = results[0];
    return refer;
  })
})

export const openMockAccount = createAction(
  OPEN_MOCK_ACCOUNT,
  (params) => {
    return post('/v1/mobile/account/open/demo', {
      data: params
    })
  }
)

export const updateServerName = createAction(
  UPDATE_SERVER_NAME,
  ({serverName, vendor}) => ({serverName, vendor})
)

export const updateAccountName = createAction(
  UPDATE_ACCOUNT_NAME,
  (accountName) => accountName
)

export const updateEmail = createAction(
  UPDATE_EMAIL,
  (email) => email
)

export const updateAccountType = createAction(
  UPDATE_ACCOUNT_TYPE,
  ({typeId, typeName}) => ({typeId, typeName})
)