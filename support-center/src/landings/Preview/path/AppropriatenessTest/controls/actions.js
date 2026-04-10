import { createAction } from "redux-actions";
import { get } from "utils/ajax";

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = "PREVIEW_APPROPRIATENESS_TEST";
export const GET_TEST_DETAIL = `${PRE_FIX}GET_TEST_DETAIL`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getTestDetail = createAction(GET_TEST_DETAIL, info =>
  get({
    url: "/v2/os/tenants/question/preview"
  })
);
