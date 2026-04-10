import { handleActions } from 'redux-actions';
import { GET_DEPOSIT_LIST, GET_DEPOSIT_DETAIL } from './actions';

export const depositList = handleActions(
  {
    [GET_DEPOSIT_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const depositDetail = handleActions(
  {
    [GET_DEPOSIT_DETAIL]: (state, { payload }) => payload
  },
  { data: [] }
);
