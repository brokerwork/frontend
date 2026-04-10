import { handleActions } from 'redux-actions';
import {
  GET_PERSONAL_REPORT,
  GET_SUB_USER_TREE,
  GET_PERSONAL_RULE,
  GET_SYSTEM_SETTINGS
} from './actions';

export const personalReportSet = handleActions(
  {
    [GET_PERSONAL_REPORT]: (state, { type, payload }) => payload
  },
  {
    open: false,
    timeZone: 8,
    userIds: [],
    emails: []
  }
);

export const subUserTree = handleActions(
  
  {
    [GET_SUB_USER_TREE]: (state, { type, payload }) => payload
  },
  []
);

export const personalRules = handleActions(
  {
    [GET_PERSONAL_RULE]: (state, { type, payload }) => payload
  },
  []
);

export const systemSettings = handleActions(
  {
    [GET_SYSTEM_SETTINGS]: (state, { type, payload }) => payload
  },
  {}
);
