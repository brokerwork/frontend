import { handleActions } from 'redux-actions';
import { GET_COLUMNS, SORT_LIST } from './actions';

export const columns = handleActions(
  {
    [GET_COLUMNS]: (state, { payload }) => payload || []
  },
  []
);
