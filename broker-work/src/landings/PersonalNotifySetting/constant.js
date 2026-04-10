import i18n from 'utils/i18n';
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
    label: i18n['settings.important_notify_way_task.TELEGRAPHIC_DEPOSIT_TASK'],
    value: 'TELEGRAPHIC_DEPOSIT_TASK'
  },
  {
    label: i18n['settings.important_notify_way_task.BW_TRANSFER_TASK'],
    value: 'BW_TRANSFER_TASK'
  },
  {
    label: i18n['settings.important_notify_way_task.BW_TRANSFER_TASK'],
    value: 'BW_WITHDRAWAL_TASK'
  }
];

export const NOTIFY_WAY_TASK_OPTION = [
  {
    label: i18n['settings.important_notify_way_task.ta_open'],
    value: 'JOB_TYPE_TA_OPEN'
  },
  {
    label: i18n['settings.important_notify_way_task.ta_same_open'],
    value: 'JOB_TYPE_TA_SAME_OPEN'
  },
  {
    label: i18n['settings.important_notify_way_task.ta_deposit'],
    value: 'JOB_TYPE_TA_DEPOSIT'
  },
  {
    label: i18n['settings.important_notify_way_task.ta_withdraw'],
    value: 'JOB_TYPE_TA_WITHDRAW'
  },
  {
    label: i18n['settings.important_notify_way_task.ta_transfer'],
    value: 'JOB_TYPE_TA_TRANSFER'
  },
  {
    label: i18n['settings.important_notify_way_task.ta_leverage'],
    value: 'JOB_TYPE_TA_LEVERAGE'
  },
  {
    label: i18n['settings.important_notify_way_task.ta_bind'],
    value: 'JOB_TYPE_TA_BIND'
  },
  {
    label: i18n['settings.important_notify_way_task.update_owner'],
    value: 'JOB_TYPE_TA_UPDATE_OWNER'
  },
  {
    label: i18n['settings.important_notify_way_task.reset_trade'],
    value: 'JOB_TYPE_TA_RESET_TRADE'
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
    label: i18n['settings.important_notify_way_task.BW_TRANSFER_TASK'],
    value: 'BW_WITHDRAWAL_TASK'
  }
];
export const NOTIFY_RESULT_TASK_OPTION = [
  {
    label: i18n['settings.self_notify.result_options.finish'],
    value: 'Finish'
  },
  {
    label: i18n['settings.self_notify.result_options.success'],
    value: 'Success'
  },
  {
    label: i18n['settings.self_notify.result_options.refuse'],
    value: 'Refuse'
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
  TELEGRAPHIC_DEPOSIT_TASK: i18n['settings.notify_task.deposit_task'],
  BW_TRANSFER_TASK: i18n['settings.notify_task.transfer_task'],
  BW_WITHDRAWAL_TASK: i18n['settings.notify_task.withdrawal']
};

export const SCOPE = [
  {
    label: i18n['customer.search_type.direct'],
    value: 'My',
    right: 'CUSTOMER_SELECT_DIRECTLY'
  },
  {
    label: i18n['customer.search_type.no_direct'],
    value: 'Sub',
    right: 'CUSTOMER_SELECT_SUBORDINATE'
  },
  {
    label: i18n['customer.search_type.participant'],
    value: 'Participate',
    right: 'CUSTOMER_SELECT_JOIN'
  },
  {
    label: i18n['customer.search_type.followed'],
    value: 'Concerned',
    default: true
  }
];
