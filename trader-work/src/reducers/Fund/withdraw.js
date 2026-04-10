import { handleActions } from "redux-actions";
import { TRANSFER } from "@/actions/Fund/transfer";
import {
  GET_WITHDRAW_LIST,
  GET_WITHDRAW_FIELDS,
  FETCH_FIELDS
} from "@/actions/Fund/withdraw";

export const serverList = handleActions(
  {
    [TRANSFER]: (state, { payload }) => payload
  },
  []
);

export const withdrawList = handleActions(
  {
    [GET_WITHDRAW_LIST]: (state, { payload }) => payload
  },
  []
);
export const withdrawFields = handleActions(
  {
    [FETCH_FIELDS]: (state, { payload }) => payload
  },
  []
);
