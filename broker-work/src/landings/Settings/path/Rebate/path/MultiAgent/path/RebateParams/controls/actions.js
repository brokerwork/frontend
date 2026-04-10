import { get, post } from 'utils/ajax';
import { createAction } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'REBATE_SETTING_PARAMS_SETTING_';
export const GET_RULE_LIST = `${PRE_FIX}GET_RULE_LIST`;
export const GET_RULE_DETAIL = `${PRE_FIX}GET_RULE_DETAIL`;
export const CREATE_RULE_DETAIL = `${PRE_FIX}CREATE_RULE_DETAIL`;
export const UPDATE_RULE_DETAIL = `${PRE_FIX}UPDATE_RULE_DETAIL`;
export const REMOVE_RULE_DETAIL = `${PRE_FIX}REMOVE_RULE_DETAIL`;
export const CHECK_PARAMETER = `${PRE_FIX}CHECK_PARAMETER`;
export const ADJUST_PERIOD = `${PRE_FIX}ADJUST_PERIOD`;
export const SET_CONDITION = `${PRE_FIX}SET_CONDITION`;

export const getRuleList = createAction(GET_RULE_LIST, ruleId =>
  get({
    url: `/v1/report/setting/ruleDetail/list/${ruleId}`
  })
);

export const createRuleDetail = createAction(CREATE_RULE_DETAIL, detail =>
  post({
    url: '/v1/report/setting/ruleDetail/add',
    data: detail
  })
);
export const updateRuleDetail = createAction(UPDATE_RULE_DETAIL, detail =>
  post({
    url: '/v1/report/setting/ruleDetail/update',
    data: detail
  })
);
export const removeRuleDetail = createAction(REMOVE_RULE_DETAIL, id =>
  post({
    url: `/v1/report/setting/ruleDetail/delete/${id}`
  })
);
export const checkParameter = createAction(CHECK_PARAMETER, id =>
  post({
    url: `/v1/report/setting/ruleDetail/deleteCheck/${id}`
  })
);
export const adjustPeriod = createAction(
  CHECK_PARAMETER,
  ({ period, ruleId }) =>
    post({
      url: `/v1/report/setting/rule/${ruleId}/adjust/period/${period}`
    })
);
export const setCondition = createAction(SET_CONDITION, (id, data) =>
  post({
    url: `/v1/report/setting/rule/detail/param/condition/${id}`,
    data
  })
);
export const getRuleDetail = createAction(GET_RULE_DETAIL, id =>
  get({
    url: `/v1/report/setting/rule/${id}`
  })
);
