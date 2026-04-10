import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'PROFIT_RULE_SETTING_';

export const GET_RULE_LIST = `${PRE_FIX}GET_RULE_LIST`;
export const SELECT_RULE = `${PRE_FIX}SELECT_RULE`;
export const UPDATE_SELECTED_RULE = `${PRE_FIX}UPDATE_SELECTED_RULE`;
export const CREATE_RULE = `${PRE_FIX}CREATE_RULE`;
export const UPDATE_RULE = `${PRE_FIX}UPDATE_RULE`;
export const REMOVE_RULE = `${PRE_FIX}REMOVE_RULE`;
export const GET_RULE_DETAIL = `${PRE_FIX}GET_RULE_DETAIL`;
export const CREATE_RULE_DETAIL = `${PRE_FIX}CREATE_RULE_DETAIL`;
export const UPDATE_RULE_DETAIL = `${PRE_FIX}UPDATE_RULE_DETAIL`;
export const REMOVE_RULE_DETAIL = `${PRE_FIX}REMOVE_RULE_DETAIL`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getRuleList = createAction(GET_RULE_LIST, () =>
  get({
    url: '/v1/report/setting/rule/list/3'
  })
);

export const selectRule = createAction(SELECT_RULE, rule => rule);

export const updateSelectedRule = createAction(
  UPDATE_SELECTED_RULE,
  rule => rule
);

export const createRule = createAction(CREATE_RULE, rule =>
  post({
    url: '/v1/report/setting/rule/add',
    data: rule
  })
);

export const updateRule = createAction(UPDATE_RULE, rule =>
  post({
    url: '/v1/report/setting/rule/update',
    data: rule
  })
);

export const removeRule = createAction(REMOVE_RULE, id =>
  post({
    url: `/v1/report/setting/rule/delete/${id}`
  })
);

export const getRuleDetail = createAction(GET_RULE_DETAIL, ruleId =>
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
