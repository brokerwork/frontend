import { handleActions } from 'redux-actions';
import { GET_TEST_RESULT } from './actions';

export const testResult = handleActions(
  {
    [GET_TEST_RESULT]: (state, { type, payload }) => payload || {}
  },
  {}
);
