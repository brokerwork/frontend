import { handleActions } from "redux-actions";
import { GET_SERVER_LIST } from "./actions";

export const serverList = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) => payload
  },
  []
);
