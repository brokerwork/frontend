import { handleActions } from "redux-actions";

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { GET_CONNECTOR_LIST } from "./actions";

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const connectorList = handleActions(
  {
    [GET_CONNECTOR_LIST]: (state, { payload }) => payload.connectors || []
  },
  []
);
