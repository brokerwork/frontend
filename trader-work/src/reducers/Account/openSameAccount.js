import { handleActions } from "redux-actions";
import {
  SAME_SAVE_FIELD_INFO,
  SAME_FIELDS_SAME_INFO,
  GET_SAME_ACCOUNT_CONFIG
} from "@/actions/Account/openSameAccount";

export const fieldsSameData = handleActions(
  {
    [SAME_FIELDS_SAME_INFO]: (state, { payload }) => payload,
    [SAME_SAVE_FIELD_INFO]: (state, { payload }) =>
      Object.assign({}, state, payload)
  },
  null
);

export const sameAccountConfig = handleActions(
  {
    [GET_SAME_ACCOUNT_CONFIG]: (state, { payload }) => payload
  },
  {}
);
