import { handleActions } from 'redux-actions';
import { GET_ARTICLE } from './actions';

export const data = handleActions(
  {
    [GET_ARTICLE]: (state, { payload }) => payload
  },
  {}
);
