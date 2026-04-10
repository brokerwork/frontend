import { handleActions } from 'redux-actions';
import {
  GET_RULE_LIST,
  SELECT_RULE,
  UPDATE_SELECTED_RULE,
  GET_PVMAP_LIST,
  GET_RULE_DETAIL,
  GET_MIN_SECONDS
} from './actions';

import { DEFAULT_RULE } from '../constant';

export const rule_list = handleActions(
  {
    [GET_RULE_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const selected_rule = handleActions(
  {
    [SELECT_RULE]: (state, { type, payload }) => payload,
    [UPDATE_SELECTED_RULE]: (state, { type, payload }) => payload
  },
  DEFAULT_RULE
);

export const pvmap_list = handleActions(
  {
    [GET_PVMAP_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const rule_detail = handleActions(
  {
    [GET_RULE_DETAIL]: (state, { type, payload }) => payload
  },
  []
);

export const minSeconds = handleActions(
  {
    [GET_MIN_SECONDS]: (state, { type, payload }) => payload
  },
  ''
);
