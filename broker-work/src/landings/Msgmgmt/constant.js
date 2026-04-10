import i18n from 'utils/i18n';

// 消息类型数组 用于dropdown输出
export const MESSAGE_TYPES = [
  {
    label: i18n['message.types.ALL'],
    value: 'ALL',
    right: 'MESSAGE_SEND_TYPE'
  },
  {
    label: i18n['message.types.WEB'],
    value: 'WEB',
    right: 'MESSAGE_SEND_TYPE_SN'
  },
  {
    label: i18n['message.types.WEB_ALERT'],
    value: 'WEB_ALERT',
    right: 'MESSAGE_SEND_TYPE_POP'
  },
  {
    label: i18n['message.types.MAIL'],
    value: 'MAIL',
    right: 'MESSAGE_SEND_TYPE_EMAIL'
  },
  {
    label: i18n['message.types.SMS'],
    value: 'SMS',
    right: 'MESSAGE_SEND_TYPE_SMS'
  }
];

// 消息类型Map 用户表格显示Label
export const MESSAGE_TYPES_OBJECT = {};
MESSAGE_TYPES.forEach(item => (MESSAGE_TYPES_OBJECT[item.value] = item.label));

// 消息类型数组map化 用map的方式便于查询
export const MESSAGE_TYPES_MAP = {};
MESSAGE_TYPES.forEach(item => (MESSAGE_TYPES_MAP[item.value] = item));

// 消息发送状态
export const MESSAGE_STATUS = {
  STATUS_SUCCESS: i18n['message.status.STATUS_SUCCESS'],
  STATUS_FAIL: i18n['message.status.STATUS_FAIL'],
  STATUS_RETRY: i18n['message.status.STATUS_RETRY']
};

// 时间段选项
export const TIMES_OPTIONS = [
  { label: i18n['message.three_months'], value: true },
  { label: i18n['message.history'], value: false }
];

export const TIME_OPTIONS = [
  { label: i18n['message.three_months'], value: 'threeMonth' },
  { label: i18n['message.history'], value: 'history' }
];

export const QUERY_TYPE_OPTIONS = [
  { label: i18n['message.inbox'], value: 'RECYCLE_INBOX' },
  { label: i18n['message.outbox'], value: 'RECYCLE_OUTBOX' },
  { label: i18n['message.draft_box'], value: 'RECYCLE_DRAFT' }
];

export const getToUserValue = item => {
  let { toAll, toUserType, toName = [], toRoleName = [] } = item;
  if (toAll) {
    return i18n[`message.recipient_type.${toUserType}`];
  }

  if (!Array.isArray(toName)) {
    toName = [toName];
  }

  return toName.concat(toRoleName).join(',');
};
