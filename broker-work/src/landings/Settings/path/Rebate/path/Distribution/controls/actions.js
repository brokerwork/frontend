import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { getRealTimeStatus } from '../../RealTimeRebate/controls/actions';
// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'DISTRIBUTION_RULE_SETTING_';

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
export const SWITCH_RULE_TYPE = `${PRE_FIX}SWITCH_RULE_TYPE`;
export const SAVE_MIN_SECONDS = `${PRE_FIX}SAVE_MIN_SECONDS`;
export const GET_MIN_SECONDS = `${PRE_FIX}GET_MIN_SECONDS`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

const ruleTypeMap = {
  2: 0,
  4: 1
};
export const switchRuleType = createAction(
  SWITCH_RULE_TYPE,
  (modelValue, rule) => dispatch => {
    const type = ruleTypeMap[modelValue];
    dispatch(updateSelectedRule(rule));
    const p = post({
      url: `/v1/report/setting/commission/distribution/swich/${type}`
    });
    p.then(() => {
      // 切换模式后实时返佣状态也需要更新;
      dispatch(getRealTimeStatus());
    });

    return p;
  }
);

export const getRuleList = createAction(GET_RULE_LIST, (type = 2) =>
  get({
    url: `/v1/report/setting/rule/list/${type}`
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
    url: `/v1/report/setting/distributionRuleDetail/list/${ruleId}`
  })
);

export const updateRuleDetail = createAction(UPDATE_RULE_DETAIL, detail =>
  post({
    url: '/v1/report/setting/distributionRuleDetail/update',
    data: detail
  })
);

export const saveMinSeconds = createAction(SAVE_MIN_SECONDS, seconds =>
  post({
    url: `/v1/report/setting/commission/minseconds/${seconds}`
  })
);

export const getMinSeconds = createAction(GET_MIN_SECONDS, () =>
  post({
    url: '/v1/report/setting/commission/minseconds'
  })
);
