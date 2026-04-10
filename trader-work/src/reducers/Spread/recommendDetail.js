import { handleActions } from "redux-actions";
import {
    GET_COMMENDS_INFO,
    GET_COMMENDS_CHILD_LIST,
    GET_COMMENDS_LIST,
    FETCH_LIST
} from "@/actions/Spread/recommendDetail";

export const commendsInfo = handleActions({
    [GET_COMMENDS_INFO]: (state, { payload }) => payload
}, {});

export const commendsPageData = handleActions({
    [GET_COMMENDS_LIST]: (state, { payload }) => payload
}, {});

export const commendsChildList = handleActions({
        [GET_COMMENDS_CHILD_LIST]: (state, { payload }) => payload
    },
    null
);

export const recommendListData = handleActions({
    [FETCH_LIST]: (state, { type, payload }) => payload
}, {})