import i18n from 'utils/i18n';

export const COLUMNS = [
  { key: 'sort' },
  { key: 'accountTypeName' },
  { key: 'accountTypDesc' },
  { key: 'accountCategory' },
  { key: 'operation' }
];

export const ACCOUNT_CATEGORY = [
  { value: 'Individual', label: i18n['trader.account.manage.Individual'] },
  { value: 'Corporation', label: i18n['trader.account.manage.Corporation'] },
  { value: 'Other', label: i18n['trader.account.manage.Other'] }
];
