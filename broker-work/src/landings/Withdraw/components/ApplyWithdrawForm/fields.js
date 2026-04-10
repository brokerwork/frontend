import i18n from 'utils/i18n';
const required = {
  validateType: {
    required: true
  }
};
const readonly = {
  readonly: true
};

export default {
  accountId: {
    label: i18n['withdraw.form.label.accountId'],
    ...readonly
  },
  accountName: {
    label: i18n['withdraw.form.label.accountName'],
    ...readonly,
    columns: 1
  },
  currency: {
    label: i18n['withdraw.form.label.payCurrency'],
    ...readonly,
    columns: 1
  },
  accountBalance: {
    label: i18n['withdraw.form.label.accountBalance'],
    columns: 1,
    ...readonly
  },
  accountActualBalance: {
    label: i18n['withdraw.form.label.accountActualBalance'],
    columns: 1,
    ...readonly
  },
  withdrawType: {
    label: i18n['withdraw.bw_withdrawType'],
    size: 30,
    fieldType: 'select',
    optionList: [],
    searchable: false,
    ...required
  },
  payCurrency: {
    label: i18n['withdraw.form.label.withdrawCurrency'],
    size: 30,
    fieldType: 'select',
    optionList: [],
    searchable: false,
    ...required
  },
  withdrawAmount: {
    label: i18n['withdraw.form.label.withdrawAmount'],
    size: 20,
    fieldType: 'Number',
    ...required
  }
};
export const FIELDS_BANK_CARD = {
  bankAccountName: {
    label: i18n['withdraw.form.label.bankAccountName'],
    size: 30,
    ...required
  },
  bankAccount: {
    label: i18n['withdraw.form.label.bankAccountNumber'],
    size: 30,
    ...required
  },
  bankName: {
    label: i18n['withdraw.form.label.bankName'],
    fieldType: 'select',
    optionList: [],
    searchable: true,
    type: 'edit',
    placeHolder: i18n['withdraw.add_bank.tip'],
    ...required
  },
  bankBranchName: {
    label: i18n['withdraw.form.label.bankBranchName'],
    size: 50,
    ...required
  },
  swift: { label: i18n['withdraw.form.label.swift'], size: 20 },
  bankAddress: {
    label: i18n['withdraw.form.label.bankAddress'],
    size: 100,
    fieldType: 'textarea'
  }
};
export const FIELDS_CHECK = {
  bankAccount: {
    label: i18n['withdraw.form.label.bankAccountNumber'],
    size: 30,
    ...required
  },
  bankName: {
    label: i18n['withdraw.form.label.bankName'],
    fieldType: 'select',
    optionList: [],
    searchable: true,
    type: 'edit',
    placeHolder: i18n['withdraw.add_bank.tip'],
    ...required
  }
};

export const FIELDS_DIGITAL_CASH = {
  receiveAddress: {
    label: i18n['withdraw.bw_receiveAddress'],
    size: 100,
    ...required
  }
};
