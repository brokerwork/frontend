import i18n from 'utils/i18n';
import { required } from 'utils/v2/renderField';

export const typeList = [
  { label: i18n['account.edit_account_money.deposit'], value: 'deposit' },
  { label: i18n['account.edit_account_money.withdraw'], value: 'withdraw' },
  {
    label: i18n['account.edit_account_money.withdraw_task'],
    value: 'withdraw_task',
    right: 'ACCOUNT_MODIFY_ADD_WITHDRAW_TASK'
  },
  {
    label: i18n['account.edit_account_money.transfer_task'],
    value: 'transfer_task',
    right: 'ACCOUNT_MODIFY_ADD_TRANSFER_TASK'
  }
];
// 验证
const validateWithdrawAmount = (value, allValue) => {
  if (allValue.curMaxWithdrawAmount && value > allValue.curMaxWithdrawAmount) {
    return i18n['settings.deposit_withdraw.create_task.withdrawAmount.error'];
  } else {
    return undefined;
  }
};
const validateBankAccount = (value, allValue) => {
  if (value == allValue.account) {
    return i18n['settings.deposit_withdraw.create_task.bankAccount.error'];
  } else {
    return undefined;
  }
};
export const notHideBox = [
  'account',
  'accountName',
  'currency',
  'balance',
  'curMaxWithdrawAmount',
  'withdrawCurrency',
  'comment'
];
export const isShowFieldsByWithdraw = {
  DIGITAL_CASH: [
    'bankAccount',
    'bankAccountName',
    'bank',
    'bankBranchName',
    'SWIFT',
    'bankAddress'
  ],
  BANK_CARD: ['receiveAddress'],
  CHECK: [
    'bankAccountName',
    'bankBranchName',
    'SWIFT',
    'bankAddress',
    'receiveAddress'
  ],
  OFFLINE_CHECK: [
    'bankAccount',
    'bankAccountName',
    'bank',
    'bankBranchName',
    'SWIFT',
    'bankAddress',
    'receiveAddress'
  ],
  AUTH_OFFLINE_CHECK: [
    'bankAccount',
    'bankAccountName',
    'bank',
    'bankBranchName',
    'SWIFT',
    'bankAddress',
    'receiveAddress'
  ]
};
export const defaultState = {
  info: {
    type: 'deposit',
    sendEmail: 1,
    amount: '',
    remark: 'Deposit'
  },
  fakeInfo: {
    type: 'deposit',
    sendEmail: 1,
    amount: '',
    remark: 'Deposit'
  },
  cbrokerInfo: {
    type: 'deposit',
    sendEmail: 1
  },
  isDisabled: false,
  fieldItem: [
    {
      key: 'account',
      fieldType: 'textField',
      hide: false,
      disabled: true
    },
    {
      key: 'accountName',
      fieldType: 'textField',
      hide: false,
      disabled: true
    },
    {
      key: 'currency',
      fieldType: 'textField',
      hide: false,
      disabled: true
    },
    {
      key: 'balance',
      fieldType: 'textField',
      hide: false,
      disabled: true
    },
    {
      key: 'curMaxWithdrawAmount',
      fieldType: 'textField',
      hide: false,
      disabled: true
    },
    {
      key: 'withdrawCurrency',
      fieldType: 'selectField',
      hide: false,
      list: []
    },
    {
      key: 'withdrawType',
      fieldType: 'selectField',
      hide: false,
      required: true,
      list: [],
      validateType: [required]
    },
    {
      key: 'withdrawAmount',
      fieldType: 'textField',
      hide: false,
      required: true,
      validateType: [required, validateWithdrawAmount]
    },
    {
      key: 'bankAccount',
      fieldType: 'textField',
      hide: false,
      required: true,
      validateType: [required, validateBankAccount]
    },
    {
      key: 'bankAccountName',
      fieldType: 'textField',
      hide: false,
      required: true,
      validateType: [required]
    },
    {
      key: 'bank',
      fieldType: 'selectField',
      hide: false,
      searchable: true,
      list: [],
      required: true,
      validateType: [required],
      edit: 'edit',
      placeholder: i18n['withdraw.add_bank.tip']
    },
    {
      key: 'bankBranchName',
      fieldType: 'textField',
      hide: false
    },
    {
      key: 'SWIFT',
      fieldType: 'textField',
      hide: false
    },
    {
      key: 'bankAddress',
      fieldType: 'textField',
      hide: false
    },
    {
      key: 'receiveAddress',
      fieldType: 'textField',
      hide: false
    },
    {
      key: 'comment',
      fieldType: 'textField',
      hide: false
    }
  ],
  optionType: 'deposit',
  notice: '',
  showExchange: '',
  finalExchange: '',
  payCurrency: '',
  // 出金任务初始信息
  withdrawTaskInfo: {
    account: '',
    accountName: '',
    currency: '',
    balance: '',
    curMaxWithdrawAmount: '',
    withdrawCurrency: '',
    withdrawType: '',
    withdrawAmount: '',
    bankAccount: '',
    bankAccountName: '',
    bank: '',
    bankBranchName: '',
    SWIFT: '',
    bankAddress: '',
    receiveAddress: '',
    comment: ''
    // banks: '',
    // bankNo: '',
    // authName: '',
    // IdCard: ''
  },
  showInfo: false,
  disabled: false,
  transferField: [
    {
      key: 'account',
      fieldType: 'textField',
      hide: false,
      disabled: true
    },
    {
      key: 'accountName',
      fieldType: 'textField',
      hide: false,
      disabled: true
    },
    {
      key: 'currency',
      fieldType: 'textField',
      hide: false,
      disabled: true
    },
    {
      key: 'balance',
      fieldType: 'textField',
      hide: false,
      disabled: true
    },
    {
      key: 'maxWithdraw',
      fieldType: 'textField',
      hide: false,
      disabled: true
    },
    {
      key: 'transferAmount',
      fieldType: 'textField',
      hide: false,
      required: true,
      validateType: [validateWithdrawAmount]
    },
    {
      key: 'receiptUser',
      fieldType: 'selectField',
      hide: false,
      list: [],
      required: true
    },
    {
      key: 'receiptAccount',
      fieldType: 'textField',
      hide: true,
      required: true,
      validateType: [required]
    },
    {
      key: 'receiptAccountName',
      fieldType: 'textField',
      hide: true,
      required: true
    },
    {
      key: 'receiptServer',
      fieldType: 'selectField',
      hide: true,
      list: [],
      required: true
    },
    {
      key: 'comment',
      fieldType: 'textField',
      hide: false
    }
  ],
  transferTaskInfo: {
    account: '',
    accountName: '',
    currency: '',
    balance: '',
    maxWithdraw: '',
    transferAmount: '',
    receiptUser: '',
    receiptAccount: '',
    receiptAccountName: '',
    receiptServer: '',
    comment: ''
  }
};
