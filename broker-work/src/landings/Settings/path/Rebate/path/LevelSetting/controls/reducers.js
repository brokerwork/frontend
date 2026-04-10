import { handleActions } from 'redux-actions';
import {
  GET_LEVEL_LIST,
  GET_USER_COUNT_DETAIL,
  UPDATE_CURRENT_LEVEL,
  GET_DEFAULT_LEVEL,
  GET_DEFAULT_LEVEL_LIST
} from './actions';

export const level_list = handleActions(
  {
    [GET_LEVEL_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const user_count_list = handleActions(
  {
    [GET_USER_COUNT_DETAIL]: (state, { type, payload }) => payload
  },
  []
);

export const current_level = handleActions(
  {
    [UPDATE_CURRENT_LEVEL]: (state, { type, payload }) => payload
  },
  []
);
export const defaultLevel = handleActions(
  {
    [GET_DEFAULT_LEVEL]: (state, { type, payload }) => payload || {}
  },
  {}
);
export const defaultLevelList = handleActions(
  {
    [GET_DEFAULT_LEVEL_LIST]: (state, { type, payload }) => payload
  },
  []
);
