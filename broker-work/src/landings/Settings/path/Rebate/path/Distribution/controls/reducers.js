import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  GET_RULE_LIST,
  SELECT_RULE,
  UPDATE_SELECTED_RULE,
  GET_RULE_DETAIL,
  GET_MIN_SECONDS
} from './actions';

import { GET_REAL_TIME_STATUS } from '../../RealTimeRebate/controls/actions';

import { DEFAULT_DISTRIBUTION_RULE } from '../constant';

export const rule_list = handleActions(
  {
    [GET_RULE_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const selected_rule = handleActions(
  {
    [SELECT_RULE]: (state, { type, payload }) => {
      if (!payload) {
        const { ruleType } = state;
        return { ...DEFAULT_DISTRIBUTION_RULE, ruleType };
      }
      return payload;
    },
    // 获取实时返佣的接口返回了当前返佣的模式 0为模式一ruleType=2 1为模式二ruleType=4
    [GET_REAL_TIME_STATUS]: (state, { type, payload }) => {
      const { distributionType } = payload;
      const ruleTypeMap = {
        0: 2,
        1: 4
      };
      return { ...state, ruleType: ruleTypeMap[distributionType] || 2 };
    },
    [UPDATE_SELECTED_RULE]: (state, { type, payload }) => payload
  },
  DEFAULT_DISTRIBUTION_RULE
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
