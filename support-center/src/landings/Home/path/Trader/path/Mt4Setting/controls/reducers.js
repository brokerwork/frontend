import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { GET_STRUCTUAL } from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const structialData = handleActions(
  {
    [GET_STRUCTUAL]: (state, { payload }) => payload
  },
  {}
);
