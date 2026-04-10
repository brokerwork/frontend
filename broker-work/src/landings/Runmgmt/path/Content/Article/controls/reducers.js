import { handleActions } from 'redux-actions';
import { GET_ARTICLES, SET_PARAMS, SORT_LIST } from './actions';

export const articles = handleActions(
  {
    [GET_ARTICLES]: (state, { payload }) => payload.list || [],
    [SORT_LIST]: (state, { payload }) => payload
  },
  []
);

export const params = handleActions(
  {
    [GET_ARTICLES]: (state, { payload }) => {
      return {
        ...state,
        pager: payload.pager,
        pageSize: payload.size,
        total: payload.total
      };
    },
    [SET_PARAMS]: (state, { payload }) => payload
  },
  {
    pager: 1,
    total: 0,
    pageSize: 20,
    keyword: ''
  }
);
