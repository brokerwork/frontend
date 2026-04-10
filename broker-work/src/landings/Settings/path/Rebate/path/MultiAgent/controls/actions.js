import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'DEPOSIT_MULTI_RULE_SETTING_';
export const CHANGE_RULE_PRIORITY = `${PRE_FIX}CHANGE_RULE_PRIORITY`;
export const CHANGE_RULE_PARAMS_PRIORITY = `${PRE_FIX}CHANGE_RULE_PARAMS_PRIORITY`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const changeRulePriority = createAction(
  CHANGE_RULE_PRIORITY,
  ({ data }) =>
    post({
      url: '/v1/report/setting/rule/change/priority',
      data
    })
);

export const changeRuleParamsPriority = createAction(
  CHANGE_RULE_PARAMS_PRIORITY,
  ({ data }) =>
    post({
      url: '/v1/report/setting/ruleDetail/change/priority',
      data
    })
);
