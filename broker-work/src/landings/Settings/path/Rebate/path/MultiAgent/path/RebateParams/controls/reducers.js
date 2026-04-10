import { handleActions } from 'redux-actions';
import { GET_RULE_LIST, GET_RULE_DETAIL } from './actions';

export const ruleList = handleActions(
  {
    [GET_RULE_LIST]: (state, { payload }) => {
      return payload;
    }
  },
  []
);
export const ruleDetail = handleActions(
  {
    [GET_RULE_DETAIL]: (state, { payload }) => {
      return payload;
    }
  },
  {}
);
