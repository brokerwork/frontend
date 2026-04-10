import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_REPORT_LIST
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------


export const reportList = handleActions({
  [GET_REPORT_LIST]: (state, { payload }) => payload
}, {
  list: [],
  pagination: {
    pager: 1,
    pageSize: 10,
  }
});