import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  GET_RULE_LIST,
  SELECT_RULE,
  UPDATE_SELECTED_RULE,
  GET_RULE_DETAIL
} from './actions';
import moment from 'moment';

import { DEFAULT_PROFIT_RULE } from '../constant';

export const rule_list = handleActions(
  {
    [GET_RULE_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const rule_list_time = handleActions(
  {
    [GET_RULE_LIST]: (state, { res }) => {
      const t = res.time || '';
      return moment(t).format('YYYY-MM-DD HH:mm');
    }
  },
  ''
);

export const selected_rule = handleActions(
  {
    [SELECT_RULE]: (state, { type, payload }) => payload,
    [UPDATE_SELECTED_RULE]: (state, { type, payload }) => payload
  },
  DEFAULT_PROFIT_RULE
);

export const rule_detail = handleActions(
  {
    [GET_RULE_DETAIL]: (state, { type, payload }) => payload
  },
  []
);
