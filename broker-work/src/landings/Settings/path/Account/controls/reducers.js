import { handleActions } from 'redux-actions';

import {
  GET_ACCOUNT_GROUP_LIST,
  UPDATE_CURRENT_GROUP,
  GET_ACCOUNT_GROUP_CONFIG
} from './actions';

export const group_list = handleActions(
  {
    [GET_ACCOUNT_GROUP_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const current_group = handleActions(
  {
    [UPDATE_CURRENT_GROUP]: (state, { type, payload }) => payload
  },
  []
);

export const groupConfig = handleActions(
  {
    [GET_ACCOUNT_GROUP_CONFIG]: (state, { type, payload }) => payload
  },
  []
);
