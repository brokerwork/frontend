import { handleActions } from 'redux-actions';
import { GET_MENU_DETAIL } from './actions';

export const menuDetail = handleActions(
  {
    [GET_MENU_DETAIL]: (state, { payload }) => payload
  },
  {}
);
