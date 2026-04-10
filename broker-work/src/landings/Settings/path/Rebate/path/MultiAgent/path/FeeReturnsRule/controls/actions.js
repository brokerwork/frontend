import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { DEFAULT_RULE } from '../constant';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'TRANSACTION_RULE_SETTING_';

export const GET_RULE_LIST = `${PRE_FIX}GET_RULE_LIST`;
export const SELECT_RULE = `${PRE_FIX}SELECT_RULE`;
export const UPDATE_SELECTED_RULE = `${PRE_FIX}UPDATE_SELECTED_RULE`;
export const CREATE_RULE = `${PRE_FIX}CREATE_RULE`;
export const UPDATE_RULE = `${PRE_FIX}UPDATE_RULE`;
export const REMOVE_RULE = `${PRE_FIX}REMOVE_RULE`;
export const GET_PVMAP_LIST = `${PRE_FIX}GET_PVMAP_LIST`;
export const CREATE_PVMAP = `${PRE_FIX}CREATE_PVMAP`;
export const UPDATE_PVMAP = `${PRE_FIX}UPDATE_PVMAP`;
export const REMOVE_PVMAP = `${PRE_FIX}REMOVE_PVMAP`;
export const GET_RULE_DETAIL = `${PRE_FIX}GET_RULE_DETAIL`;
export const CREATE_RULE_DETAIL = `${PRE_FIX}CREATE_RULE_DETAIL`;
export const UPDATE_RULE_DETAIL = `${PRE_FIX}UPDATE_RULE_DETAIL`;
export const REMOVE_RULE_DETAIL = `${PRE_FIX}REMOVE_RULE_DETAIL`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getRuleList = createAction(GET_RULE_LIST, () =>
  get({
    url: '/v1/report/setting/rule/list/' + DEFAULT_RULE.ruleType
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

export const getPVmapList = createAction(GET_PVMAP_LIST, () =>
  get({
    url: '/v1/report/setting/pvmap/list'
  })
);

export const createPVmap = createAction(CREATE_PVMAP, pvmap =>
  post({
    url: '/v1/report/setting/pvmap/save',
    data: pvmap
  })
);

export const updatePVmap = createAction(UPDATE_PVMAP, pvmap =>
  post({
    url: '/v1/report/setting/pvmap/update',
    data: pvmap
  })
);

export const removePVmap = createAction(REMOVE_PVMAP, id =>
  post({
    url: `/v1/report/setting/pvmap/delete/${id}`
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
