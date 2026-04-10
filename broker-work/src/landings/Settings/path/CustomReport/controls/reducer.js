import { handleActions } from 'redux-actions';
import {
  GET_CUSTOM_REPORT_LIST,
  MODIFY_PAGE,
  GET_SETTLE_TIME
} from './actions';
import _ from 'lodash';

export const customReportList = handleActions(
  {
    [GET_CUSTOM_REPORT_LIST]: (state, { payload }) => payload
  },
  {}
);

export const pageParam = handleActions(
  {
    [GET_CUSTOM_REPORT_LIST]: (state, { payload }) => ({
      pageNo: payload.pager,
      pageSize: payload.size,
      pages: payload.pages,
      total: payload.total
    }),
    [MODIFY_PAGE]: (state, { payload }) => payload
  },
  {
    pageNo: 1,
    pageSize: 10
  }
);

export const settleTime = handleActions(
  {
    [GET_SETTLE_TIME]: (state, { payload }) => _.get(payload, 'time', '08:00')
  },
  '08:00'
);
