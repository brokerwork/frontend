import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'PERSONAL_REPORT_';

export const GET_PERSONAL_REPORT = `${PRE_FIX}GET_PERSONAL_REPORT`;
export const SET_PERSONAL_REPORT = `${PRE_FIX}SET_PERSONAL_REPORT`;
export const GET_SUB_USER_TREE = `${PRE_FIX}GET_SUB_USER_TREE`;
export const GET_PERSONAL_RULE = `${PRE_FIX}GET_PERSONAL_RULE`;
export const SET_PERSONAL_SWITCH = `${PRE_FIX}SET_PERSONAL_SWITCH`;
export const SET_RULE_SETTINGS = `${PRE_FIX}SET_RULE_SETTINGS`;
export const GET_SYSTEM_SETTINGS = `${PRE_FIX}GET_SYSTEM_SETTINGS`;

// 获取个人数据日报设置
export const getPersonalReport = createAction(GET_PERSONAL_REPORT, () =>
  get({
    url: '/v1/statistic/email/report/info?level=USER'
  })
);

//重要信息通知－系统配置

export const getSystemSettings = createAction(GET_SYSTEM_SETTINGS, () =>
  get({
    url: '/v1/notice/config/important/system/info'
  })
);

// 修改个人日报设置
export const setPersonalReport = createAction(SET_PERSONAL_REPORT, data =>
  post({
    url: '/v1/statistic/email/report/edit',
    data
  })
);

// 获取下级用户树
export const getSubUserTree = createAction(GET_SUB_USER_TREE, data =>
  get({
    url: '/v1/user/currentSubtree?module=Customer'
  })
);
// 获取个人用户规则
export const getPersonalRule = createAction(GET_PERSONAL_RULE, data =>
  get({
    url: '/v1/notice/config/important/personal/rules'
  })
);

// 启用具体某条规则
export const setPersonalSwtich = createAction(SET_PERSONAL_SWITCH, type =>
  post({
    url: `/v1/notice/config/important/personal/rule/switch?type=${type}`
  })
);

// 修改某条规则设置
export const setRulesettings = createAction(SET_RULE_SETTINGS, data =>
  post({
    url: '/v1/notice/config/important/personal/rule/save',
    data: data
  })
);
