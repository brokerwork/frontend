import i18n from 'utils/i18n';

export const BALANCE_TYPE = [
  { label: '$', value: 0 },
  { label: '%', value: 1 },
  { label: 'pip', value: 2 }
];

export const DEPOSIT_PROFIT_BALANCE_UNIT = [{ label: '%', value: 1 }];

export const DISTRIBUTION_BALANCE_TYPE = [{ label: '$', value: 0 }];
// 为分销返佣的模式二添加pip结算方式
export const DISTRIBUTION_MODE2_BALANCE_TYPE = [
  { label: 'pip', value: 2 },
  { label: '$', value: 0 }
];

export const DISTRIBUTION_BALANCE_UNIT = [
  { label: i18n['settings.rebate_setting.each_volume'], value: 0 }
];

export const CYCLE_LEVEL_LIST = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 }
];

export const DEFAULT_ROLE = {};

export const MESSAGE_TYPE_SMS = 'SMS';
export const MESSAGE_TYPE_MAIL = 'MAIL';
export const MESSAGE_TYPE_WEB_ALERT = 'WEB_ALERT';
export const MESSAGE_TYPE_WEB = 'WEB';

export const MESSAGE_TYPE = [
  {
    label: i18n['setting.message.template.message_type.email'],
    value: MESSAGE_TYPE_MAIL,
    right: 'SYSTEM_MESSAGE_EP'
  },
  {
    label: i18n['setting.message.template.message_type.web_alert'],
    value: MESSAGE_TYPE_WEB_ALERT,
    right: 'SYSTEM_MESSAGE_TP'
  },
  {
    label: i18n['setting.message.template.message_type.web'],
    value: MESSAGE_TYPE_WEB,
    right: 'SYSTEM_MESSAGE_SN'
  },
  {
    label: i18n['setting.message.template.message_type.sms'],
    value: MESSAGE_TYPE_SMS,
    right: 'SYSTEM_MESSAGE_SP'
  }
];

export const AUDIT_STATES_DRAFT = 'Draft';
export const AUDIT_STATES_SUBMIT = 'Submit';
export const AUDIT_STATES_AUDITTING = 'Auditting';
export const AUDIT_STATES_SUCCESS = 'Success';
export const AUDIT_STATES_FAILD = 'Faild';
export const AUDIT_STATES_SUBMIT_FAILD = 'Submit_Fail';
export const AUDIT_STATES_AUDIT_FAILD = 'Audit_Fail';

export const AUDIT_STATE = {
  [AUDIT_STATES_DRAFT]: i18n['setting.message.template.message_status.draft'],
  [AUDIT_STATES_SUBMIT]:
    i18n['setting.message.template.message_status.auditting'],
  [AUDIT_STATES_SUBMIT_FAILD]:
    i18n['setting.message.template.message_status.submit_faild'],
  [AUDIT_STATES_AUDIT_FAILD]:
    i18n['setting.message.template.message_status.audit_faild'],
  [AUDIT_STATES_AUDITTING]:
    i18n['setting.message.template.message_status.auditting'],
  [AUDIT_STATES_SUCCESS]:
    i18n['setting.message.template.message_status.success'],
  [AUDIT_STATES_FAILD]: i18n['setting.message.template.message_status.faild']
};

export const RIGHT_ENTITY_NO_TIPS = {
  ACCOUNT_SELECT_DIRECTLY_DW:
    i18n['settings.role_setting.account_rights.dw.tips'],
  ACCOUNT_SELECT_SUBORDINATE_DW:
    i18n['settings.role_setting.account_rights.dw.tips'],
  ACCOUNT_SELECT_WILD_DW: i18n['settings.role_setting.account_rights.dw.tips'],
  ACCOUNT_SELECT_ALL_DW: i18n['settings.role_setting.account_rights.dw.tips'],
  ACCOUNT_SELECT_DIRECTLY_TRADE:
    i18n['settings.role_setting.account_rights.trade.tips'],
  ACCOUNT_SELECT_SUBORDINATE_TRADE:
    i18n['settings.role_setting.account_rights.trade.tips'],
  ACCOUNT_SELECT_WILD_TRADE:
    i18n['settings.role_setting.account_rights.trade.tips'],
  ACCOUNT_SELECT_ALL_TRADE:
    i18n['settings.role_setting.account_rights.trade.tips']
};

export const NOTIFY_TASK_TYPE = [
  {
    label: i18n['settings.notify_task_type.withdrawal_task'],
    value: 'WITHDRAWAL_TASK'
  },
  {
    label: i18n['settings.notify_task_type.withdrawal_balance'],
    value: 'WITHDRAWAL_BALANCE'
  },
  {
    label: i18n['settings.notify_task_type.deposit_task'],
    value: 'DEPOSIT_TASK'
  },
  {
    label: i18n['settings.notify_task_type.task_handle'],
    value: 'TASK_HANDLE'
  },
  {
    label: i18n['settings.notify_task_type.credit_change'],
    value: 'CREDIT_CHANGE'
  },
  {
    label: i18n['settings.notify_task_type.balance_change'],
    value: 'BALANCE_CHANGE'
  },
  {
    label: i18n['settings.notify_task_type.margin_level'],
    value: 'MARGIN_LEVEL'
  },
  {
    label: i18n['settings.notify_task_type.transfer_task'],
    value: 'TRANSFER_TASK'
  },
  {
    label: i18n['settings.notify_task_type.margin_level.trader'],
    value: 'TRADER_MARGIN_LEVEL'
  },
  {
    label: i18n['settings.important_notify_way_task.TELEGRAPHIC_DEPOSIT_TASK'],
    value: 'TELEGRAPHIC_DEPOSIT_TASK'
  },
  {
    label: i18n['settings.important_notify_way_task.BW_TRANSFER_TASK'],
    value: 'BW_TRANSFER_TASK'
  },
  {
    label: i18n['settings.important_notify_way_task.BW_WITHDRAWAL_TASK'],
    value: 'BW_WITHDRAWAL_TASK'
  }
];

export const NOTIFY_TASK_CONTENT = {
  WITHDRAWAL_TASK: i18n['settings.notify_task.withdrawal'],
  WITHDRAWAL_BALANCE: i18n['settings.notify_task.withdrawal_balance'],
  DEPOSIT_TASK: i18n['settings.notify_task.deposit_task'],
  TASK_HANDLE: i18n['settings.notify_task.task_handle_1'],
  CREDIT_CHANGE: i18n['settings.notify_task.credit_change'],
  BALANCE_CHANGE: i18n['settings.notify_task.balance_change'],
  MARGIN_LEVEL: i18n['settings.notify_task.margin_level'],
  TRANSFER_TASK: i18n['settings.notify_task.transfer_task'],
  TRADER_MARGIN_LEVEL: i18n['settings.notify_task.margin_level.trader'],
  TELEGRAPHIC_DEPOSIT_TASK: i18n['settings.notify_task.deposit_task'],
  BW_TRANSFER_TASK: i18n['settings.notify_task.transfer_task'],
  BW_WITHDRAWAL_TASK: i18n['settings.notify_task.withdrawal']
};

export const NOTIFY_WAY = [
  {
    label: i18n['settings.notify_way.systemMsg'],
    value: 'SystemMsg'
  },
  {
    label: i18n['settings.notify_way.popup'],
    value: 'Popup'
  },
  {
    label: i18n['settings.notify_way.email'],
    value: 'Email'
  },
  {
    label: i18n['settings.notify_way.sms'],
    value: 'SMS'
  }
];

// 权限解释
export const RIGHT_ENTITY_REMINDER_TIPS = {
  USER_SELECT_DIRECTLY_COMMISSION: [
    i18n['USER_SELECT_DIRECTLY_COMMISSION.tips.0'],
    i18n['USER_SELECT_DIRECTLY_COMMISSION.tips.1']
  ],
  USER_SELECT_DIRECTLY_SENSITIVE: [
    i18n['USER_SELECT_DIRECTLY_SENSITIVE.tips.0'],
    i18n['USER_SELECT_DIRECTLY_SENSITIVE.tips.1']
  ],
  USER_SELECT_SUBORDINATE_COMMISSION: [
    i18n['USER_SELECT_SUBORDINATE_COMMISSION.tips.0'],
    i18n['USER_SELECT_SUBORDINATE_COMMISSION.tips.1']
  ],
  USER_SELECT_SUBORDINATE_SENSITIVE: [
    i18n['USER_SELECT_SUBORDINATE_SENSITIVE.tips.0'],
    i18n['USER_SELECT_SUBORDINATE_SENSITIVE.tips.1']
  ],
  USER_SELECT_ALL: [
    i18n['USER_SELECT_ALL.tips.0'],
    i18n['USER_SELECT_ALL.tips.1']
  ],
  USER_SELECT_WILD: [
    i18n['USER_SELECT_WILD.tips.0'],
    i18n['USER_SELECT_WILD.tips.1']
  ],
  USER_ADD: [i18n['USER_ADD.tips.0'], i18n['USER_ADD.tips.1']],
  USER_MODIFY: [i18n['USER_MODIFY.tips.0'], i18n['USER_MODIFY.tips.1']],
  USER_DELETE: [i18n['USER_DELETE.tips.0'], i18n['USER_DELETE.tips.1']],
  TAUSER_ENABLE: [i18n['TAUSER_ENABLE.tips.0'], i18n['TAUSER_ENABLE.tips.1']],
  CUSTOMER_SELECT_DIRECTLY_SENSITIVE: [
    i18n['CUSTOMER_SELECT_DIRECTLY_SENSITIVE.tips.0'],
    i18n['CUSTOMER_SELECT_DIRECTLY_SENSITIVE.tips.1']
  ],
  CUSTOMER_SELECT_ALL: [
    i18n['CUSTOMER_SELECT_ALL.tips.0'],
    i18n['CUSTOMER_SELECT_ALL.tips.1']
  ],
  CUSTOMER_SELECT_WILD: [
    i18n['CUSTOMER_SELECT_WILD.tips.0'],
    i18n['CUSTOMER_SELECT_WILD.tips.1']
  ],
  CUSTOMER_MODIFY: [
    i18n['CUSTOMER_MODIFY.tips.0'],
    i18n['CUSTOMER_MODIFY.tips.1']
  ],
  CUSTOMER_DELETE: [
    i18n['CUSTOMER_DELETE.tips.0'],
    i18n['CUSTOMER_DELETE.tips.1']
  ],
  CUSTOMER_TRANSFER: [
    i18n['CUSTOMER_TRANSFER.tips.0'],
    i18n['CUSTOMER_TRANSFER.tips.1']
  ],
  CUSTOMER_BIND: [i18n['CUSTOMER_BIND.tips.0'], i18n['CUSTOMER_BIND.tips.1']],
  MESSAGE_SEND: [i18n['MESSAGE_SEND.tips.0'], i18n['MESSAGE_SEND.tips.1']],
  ACCOUNT_SELECT_DIRECTLY_MTG: [
    i18n['ACCOUNT_SELECT_DIRECTLY_MTG.tips.0'],
    i18n['ACCOUNT_SELECT_DIRECTLY_MTG.tips.1']
  ],
  ACCOUNT_SELECT_DIRECTLY_GRP: [
    i18n['ACCOUNT_SELECT_DIRECTLY_GRP.tips.0'],
    i18n['ACCOUNT_SELECT_DIRECTLY_GRP.tips.1']
  ],
  ACCOUNT_SELECT_DIRECTLY_SENSITIVE: [
    i18n['ACCOUNT_SELECT_DIRECTLY_SENSITIVE.tips.0'],
    i18n['ACCOUNT_SELECT_DIRECTLY_SENSITIVE.tips.1']
  ],
  ACCOUNT_SELECT_SUBORDINATE_MTG: [
    i18n['ACCOUNT_SELECT_SUBORDINATE_MTG.tips.0'],
    i18n['ACCOUNT_SELECT_SUBORDINATE_MTG.tips.1']
  ],
  ACCOUNT_SELECT_SUBORDINATE_GRP: [
    i18n['ACCOUNT_SELECT_SUBORDINATE_GRP.tips.0'],
    i18n['ACCOUNT_SELECT_SUBORDINATE_GRP.tips.1']
  ],
  ACCOUNT_SELECT_SUBORDINATE_SENSITIVE: [
    i18n['ACCOUNT_SELECT_SUBORDINATE_SENSITIVE.tips.0'],
    i18n['ACCOUNT_SELECT_SUBORDINATE_SENSITIVE.tips.1']
  ],
  ACCOUNT_SELECT_WILD: [
    i18n['ACCOUNT_SELECT_WILD.tips.0'],
    i18n['ACCOUNT_SELECT_WILD.tips.1']
  ],
  ACCOUNT_SELECT_ALL: [
    i18n['ACCOUNT_SELECT_ALL.tips.0'],
    i18n['ACCOUNT_SELECT_ALL.tips.1']
  ],
  'ACCOUNT_MODIFY-PERSONAL': [
    i18n['ACCOUNT_MODIFY-PERSONAL.tips.0'],
    i18n['ACCOUNT_MODIFY-PERSONAL.tips.1']
  ],
  'ACCOUNT_MODIFY-DATA': [
    i18n['ACCOUNT_MODIFY-DATA.tips.0'],
    i18n['ACCOUNT_MODIFY-DATA.tips.1']
  ],
  'ACCOUNT_MODIFY-LEVER': [
    i18n['ACCOUNT_MODIFY-LEVER.tips.0'],
    i18n['ACCOUNT_MODIFY-LEVER.tips.1']
  ],
  'ACCOUNT_MODIFY-PWD': [
    i18n['ACCOUNT_MODIFY-PWD.tips.0'],
    i18n['ACCOUNT_MODIFY-PWD.tips.1']
  ],
  'ACCOUNT_MODIFY-DW': [
    i18n['ACCOUNT_MODIFY-DW.tips.0'],
    i18n['ACCOUNT_MODIFY-DW.tips.1']
  ],
  'ACCOUNT_IMPORT-DEPOSIT': [
    i18n['ACCOUNT_IMPORT-DEPOSIT.tips.0'],
    i18n['ACCOUNT_IMPORT-DEPOSIT.tips.1']
  ],
  'ACCOUNT_MODIFY-CREDIT': [
    i18n['ACCOUNT_MODIFY-CREDIT.tips.0'],
    i18n['ACCOUNT_MODIFY-CREDIT.tips.1']
  ],
  ACCOUNT_DELETE: [
    i18n['ACCOUNT_DELETE.tips.0'],
    i18n['ACCOUNT_DELETE.tips.1']
  ],
  'ACCOUNT_MODIFY-MT-GROUP': [
    i18n['ACCOUNT_MODIFY-MT-GROUP.tips.0'],
    i18n['ACCOUNT_MODIFY-MT-GROUP.tips.1']
  ],
  'ACCOUNT_MODIFY-ATS': [
    i18n['ACCOUNT_MODIFY-ATS.tips.0'],
    i18n['ACCOUNT_MODIFY-ATS.tips.1']
  ],
  ACCOUNT_MALS: [i18n['ACCOUNT_MALS.tips.0'], i18n['ACCOUNT_MALS.tips.1']],
  'ACCOUNT_MODIFY-MT-GRP': [
    i18n['ACCOUNT_MODIFY-MT-GRP.tips.0'],
    i18n['ACCOUNT_MODIFY-MT-GRP.tips.1']
  ],
  ACCOUNT_EXPORT: [
    i18n['ACCOUNT_EXPORT.tips.0'],
    i18n['ACCOUNT_EXPORT.tips.1']
  ],
  TASK_ENABLE: [i18n['TASK_ENABLE.tips.0'], i18n['TASK_ENABLE.tips.1']],
  TASK_SENSITIVE: [
    i18n['TASK_SENSITIVE.tips.0'],
    i18n['TASK_SENSITIVE.tips.1']
  ],
  SYSTEM_USER_ROLEAUTH: [
    i18n['SYSTEM_USER_ROLEAUTH.tips.0'],
    i18n['SYSTEM_USER_ROLEAUTH.tips.1']
  ],
  SYSTEM_USER_LINK: [
    i18n['SYSTEM_USER_LINK.tips.0'],
    i18n['SYSTEM_USER_LINK.tips.1']
  ],
  SYSTEM_ACCOUNT: [
    i18n['SYSTEM_ACCOUNT.tips.0'],
    i18n['SYSTEM_ACCOUNT.tips.1']
  ],
  SYSTEM_REBATE: [i18n['SYSTEM_REBATE.tips.0'], i18n['SYSTEM_REBATE.tips.1']],
  SYSTEM_LOG: [i18n['SYSTEM_LOG.tips.0'], i18n['SYSTEM_LOG.tips.1']],
  SYSTEM_DW: [i18n['SYSTEM_DW.tips.0'], i18n['SYSTEM_DW.tips.1']],
  SYSTEM_CONDITION: [
    i18n['SYSTEM_CONDITION.tips.0'],
    i18n['SYSTEM_CONDITION.tips.1']
  ],
  STAT_VIEW_ACC_RANGE_NO: [
    i18n['STAT_VIEW_ACC_RANGE_NO.tips.0'],
    i18n['STAT_VIEW_ACC_RANGE_NO.tips.1']
  ],
  STAT_VIEW_ACC_RANGE_ALL: [
    i18n['STAT_VIEW_ACC_RANGE_ALL.tips.0'],
    i18n['STAT_VIEW_ACC_RANGE_ALL.tips.1']
  ],
  STAT_VIEW_ACHIEVEMENT_RANGE_SUPERIOR: [
    i18n['STAT_VIEW_ACHIEVEMENT_RANGE_SUPERIOR.tips.0'],
    i18n['STAT_VIEW_ACHIEVEMENT_RANGE_SUPERIOR.tips.1']
  ],
  STAT_VIEW_ACHIEVEMENT_RANGE_ALL: [
    i18n['STAT_VIEW_ACHIEVEMENT_RANGE_ALL.tips.0'],
    i18n['STAT_VIEW_ACHIEVEMENT_RANGE_ALL.tips.1']
  ],
  STAT_VIEW_COMMISSION_RANGE_ALL: [
    i18n['STAT_VIEW_COMMISSION_RANGE_ALL.tips.0'],
    i18n['STAT_VIEW_COMMISSION_RANGE_ALL.tips.1']
  ],
  LIVE_LIVE: [i18n['LIVE_LIVE.tips.0'], i18n['LIVE_LIVE.tips.1']],
  LIVE_DEMAND: [i18n['LIVE_DEMAND.tips.0'], i18n['LIVE_DEMAND.tips.1']],
  BWAPI_ENABLE: [i18n['BWAPI_ENABLE.tips.0'], i18n['BWAPI_ENABLE.tips.1']]
};
