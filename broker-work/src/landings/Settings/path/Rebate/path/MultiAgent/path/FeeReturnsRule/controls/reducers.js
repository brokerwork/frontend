import { handleActions } from 'redux-actions';
import {
  GET_RULE_LIST,
  SELECT_RULE,
  UPDATE_SELECTED_RULE,
  GET_PVMAP_LIST,
  GET_RULE_DETAIL
} from './actions';

import { DEFAULT_RULE } from '../constant';
import moment from 'moment';

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
