import { handleActions } from "redux-actions";

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { GET_TEST_DETAIL } from "./actions";

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const testDetail = handleActions(
  {
    [GET_TEST_DETAIL]: (state, { payload }) => payload
  },
  []
);
