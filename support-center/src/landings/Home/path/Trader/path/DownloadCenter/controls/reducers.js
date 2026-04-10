import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_DOWNLOAD_LIST,
  FORM_EDIT_TARGET
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------


export const downloadList = handleActions({
  [GET_DOWNLOAD_LIST]: (state, { payload }) => payload
}, []);

export const editDownloaderTarget = handleActions({
  [FORM_EDIT_TARGET]: (state, {payload}) => payload
}, {})
