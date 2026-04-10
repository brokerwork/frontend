import { createAction } from 'redux-actions';
import { get, post, dele } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'TIME_REPORT_';

export const GET_NOTIFY_SETTING = `${PRE_FIX}GET_NOTIFY_SETTING`;
export const SAVE_NOTIFY_SETTING = `${PRE_FIX}SAVE_NOTIFY_SETTING`;
export const GET_RECEIVER_LIST = `${PRE_FIX}GET_RECEIVER_LIST`;
export const GET_ROLE_OPTION = `${PRE_FIX}GET_ROLE_OPTION`;
export const GET_SYSTEM_SETTINGS = `${PRE_FIX}GET_SYSTEM_SETTINGS`;
export const GET_VAS_SWITCH = `${PRE_FIX}GET_VAS_SWITCH`;
export const ADD_RULE = `${PRE_FIX}ADD_RULE`;
export const EDIT_RULE = `${PRE_FIX}EDIT_RULE`;
export const DELETE_RULE = `${PRE_FIX}DELETE_RULE`;
export const SWITCH_MAIIN = `${PRE_FIX}SWITCH_MAIIN`;
export const UPDATE_NOTIFY_WAY = `${PRE_FIX}UPDATE_NOTIFY_WAY`;
export const GET_GROUP = `${PRE_FIX}GET_GROUP`;

export const getNotifySetting = createAction(GET_NOTIFY_SETTING, () =>
  get({
    url: `/v1/statistic/email/report/info`
  })
);

export const saveNotifySetting = createAction(SAVE_NOTIFY_SETTING, data =>
  post({
    url: `/v1/statistic/email/report/edit`,
    data
  })
);

export const getReceiverList = createAction(GET_RECEIVER_LIST, data =>
  post({
    url: `/v1/message/msgReceiversQuery`,
    data
  })
);

export const getRoleOption = createAction(GET_ROLE_OPTION, () =>
  post({
    url: '/v1/roleRight/role/list'
  })
);

//重要信息通知－系统配置

export const getSystemSettings = createAction(GET_SYSTEM_SETTINGS, () =>
  get({
    url: '/v1/notice/config/important/system/info'
  })
);
// 获取sc那边是否开通短信，邮件服务
export const getVasSwitch = createAction(GET_VAS_SWITCH, () =>
  get({
    url: '/v1/product/vas/switch'
  })
);
// 重要信息通知总开关
export const switchMain = createAction(SWITCH_MAIIN, () =>
  post({
    url: '/v1/notice/config/important/system/switch'
  })
);
export const updateNotifyWay = createAction(UPDATE_NOTIFY_WAY, noticeType =>
  post({
    url: `/v1/notice/config/important/system/noticeType/switch?noticeType=${noticeType}`
  })
);
// 重要信息通知－添加规则
export const addRule = createAction(ADD_RULE, data =>
  post({
    url: '/v1/notice/config/important/system/rule/add',
    data
  })
);

// 重要信息通知－编辑规则
export const editRule = createAction(EDIT_RULE, data =>
  post({
    url: '/v1/notice/config/important/system/rule/update',
    data
  })
);

// 重要信息通知－删除规则
export const deleteRule = createAction(DELETE_RULE, data =>
  dele({
    url: '/v1/notice/config/important/system/rule',
    data
  })
);
// 系统配置-获取server的group信息
export const getGroup = createAction(GET_GROUP, data =>
  get({
    url: '/v1/notice/config/important/system/server/groups',
    data
  })
);

