import { handleActions } from 'redux-actions';
import { GET_ID_TYPE, ADD_BLACK_LIST, MODIFY_PAGE, GET_BLACK_LIST } from './actions';

export const idTypes = handleActions(
  {
    [GET_ID_TYPE]: (state, { payload = [] }) => payload
  },
  []
);

export const pageParam = handleActions(
  {
    [GET_BLACK_LIST]: (state, { payload }) => ({
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

export const blackListData = handleActions(
  {
    [GET_BLACK_LIST]: (state, { payload }) => payload
  },
  {}
);