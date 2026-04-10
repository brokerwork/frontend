import i18n from 'utils/i18n';

const EXPORT_FIELDS_COMMON = [
  {
    value: 'jobNo',
    label: i18n['task.object_detail.taskid']
  },
  {
    value: 'name',
    label: i18n['task.object_detail.username']
  },
  {
    value: 'accountId',
    label: i18n['task.object_detail.userid']
  },
  {
    value: 'comment',
    label: i18n['task.object_detail.remark']
  },
  {
    value: 'processer',
    label: i18n['task.object_detail.processor']
  },
  {
    value: 'createTime',
    label: i18n['task.object_detail.create_time']
  },
  {
    value: 'dealTime',
    label: i18n['task.object_detail.modify_time']
  },
  {
    value: 'state',
    label: i18n['task.object_detail.status']
  },
  {
    value: 'lastComment',
    label: i18n['task.object_detail.last_comment']
  },
  {
    value: 'serverId',
    label: i18n['task.details.field.server_group']
  },
  {
    value: 'group',
    label: i18n['task.details.field.mt_group']
  },
  {
    value: 'customer',
    label: i18n['task.details.field.associated']
  },
  {
    value: 'accountOwn',
    label: i18n['task.details.field.account_attribution']
  }
];

export const EXPORT_FIELDS_WITHDRAW = [
  ...EXPORT_FIELDS_COMMON,
  {
    value: 'withdrawType',
    label: i18n['task.details.field.withdrawType']
  },
  {
    value: 'bankAccountName',
    label: i18n['task.details.field.payee_name']
  },
  {
    value: 'withdrawAmount',
    label: i18n['task.details.field.withdraw_amount']
  },
  {
    value: 'currency',
    label: i18n['task.details.field.currency']
  },
  {
    value: 'withdrawRMB',
    label: i18n['task.details.field.withdraw_amount_cny']
  },
  {
    value: 'payCurrency',
    label: i18n['task.details.field.payCurrency']
  },
  {
    value: 'withdrawExchange',
    label: i18n['task.details.field.exchange_rate']
  },
  {
    value: 'bankName',
    label: i18n['task.details.field.bank_name']
  },
  {
    value: 'bankBranchName',
    label: i18n['task.details.field.bank_branch_name']
  },
  {
    value: 'bankAddress',
    label: i18n['task.details.field.bank_address']
  },
  {
    value: 'SWIFT',
    label: i18n['task.details.field.swift_code']
  },
  {
    value: 'bankAccountNumber',
    label: i18n['task.details.field.bank_account']
  },
  {
    value: 'receiveAddress',
    label: i18n['task.details.field.coin.receive_address']
  },
];
export const EXPORT_FIELDS_AGENCY_WITHDRAW = [
  ...EXPORT_FIELDS_COMMON,
  {
    value: 'withdrawType',
    label: i18n['task.details.field.withdrawType']
  },
  {
    value: 'accountName',
    label: i18n['task.details.field.payee_name']
  },
  {
    value: 'withdrawAmount',
    label: i18n['task.details.field.withdraw_amount']
  },
  {
    value: 'currency',
    label: i18n['task.details.field.currency']
  },
  {
    value: 'withdrawRMB',
    label: i18n['task.details.field.withdraw_amount_cny']
  },
  {
    value: 'payCurrency',
    label: i18n['task.details.field.payCurrency']
  },
  {
    value: 'withdrawExchange',
    label: i18n['task.details.field.exchange_rate']
  },
  {
    value: 'bankName',
    label: i18n['task.details.field.bank_name']
  },
  {
    value: 'bankBranchName',
    label: i18n['task.details.field.bank_branch_name']
  },
  {
    value: 'bankAddress',
    label: i18n['task.details.field.bank_address']
  },
  {
    value: 'SWIFT',
    label: i18n['task.details.field.swift_code']
  },
  {
    value: 'bankAccountNumber',
    label: i18n['task.details.field.bank_account']
  },
  {
    value: 'receiveAddress',
    label: i18n['task.details.field.coin.receive_address']
  },
  // bug ID1014394
  // {
  //   value: 'modifyTime',
  //   label: i18n['task.object_detail.modify_time']
  // },
  {
    value: 'field01',
    label: i18n['task.details.field.export.field01']
  },
  {
    value: 'field02',
    label: i18n['task.details.field.export.field02']
  }
].filter(item => !['customer', 'accountOwn', 'group'].includes(item.value));

export const EXPORT_FIELDS_DEPOSIT = [
  ...EXPORT_FIELDS_COMMON,
  {
    value: 'depositAmount',
    label: i18n['task.details.field.deposit_amount']
  },
  {
    value: 'payAmount',
    label: i18n['task.details.field.pay_amount']
  },
  {
    value: 'fee',
    label: i18n['task.details.field.poundage']
  },
  {
    value: 'deposit',
    label: i18n['task.details.field.deposit_balance']
  },
  {
    value: 'orderNo',
    label: i18n['task.details.field.order_number']
  },
  {
    value: 'payOrderNo',
    label: i18n['task.details.field.pay_order_number']
  },
  {
    value: 'payPlatformName',
    label: i18n['task.details.field.pay_platform']
  },
  {
    value: 'payStatus',
    label: i18n['task.details.field.pay_status']
  }
];
export const EXPORT_FIELDS_TELEGRAPHIC_DEPOSIT = [
  ...EXPORT_FIELDS_COMMON,
  {
    value: 'depositAmount',
    label: i18n['task.details.field.deposit_amount']
  },
  {
    value: 'payAmount',
    label: i18n['task.details.field.pay_amount']
  },
  {
    value: 'fee',
    label: i18n['task.details.field.poundage']
  },
  {
    value: 'deposit',
    label: i18n['task.details.field.deposit_balance']
  },
  {
    value: 'orderNo',
    label: i18n['task.details.field.order_number']
  }
];
