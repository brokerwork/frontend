import { handleActions } from 'redux-actions';
import {
  GET_RULE_LIST,
  SELECT_RULE,
  UPDATE_SELECTED_RULE,
  GET_RULE_DETAIL
} from './actions';

import { DEFAULT_DEPOSIT_RULE } from '../constant';

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
  DEFAULT_DEPOSIT_RULE
);

export const rule_detail = handleActions(
  {
    [GET_RULE_DETAIL]: (state, { type, payload }) => payload
  },
  []
);
