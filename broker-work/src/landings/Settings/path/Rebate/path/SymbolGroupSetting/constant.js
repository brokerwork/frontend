import i18n from 'utils/i18n';
export const SYMBOL_GROUP_HEADER = [
  { label: i18n['settings.rebate_setting.symbol_group_name'], value: 'name' },
  {
    label: i18n['settings.rebate_setting.transaction_symbol'],
    value: 'symbols'
  },
  {
    label: i18n['settings.rebate_setting.action'],
    value: 'actions'
  }
];

export const SYMBOL_GROUP_SORT_HEADER = [
  {
    title: i18n['settings.rebate_setting.symbol_group_name'],
    key: 'name'
  },
  {
    label: i18n['settings.rebate_setting.transaction_symbol'],
    key: 'symbols'
  },
  {
    label: i18n['settings.rebate_setting.action'],
    key: 'actions'
  }
];

export const EDIT_SYMBOL_GROUP_HEADER = [
  { label: i18n['settings.rebate_setting.symbol_group_name'], value: 'name' },
  {
    label: i18n['settings.rebate_setting.transaction_symbol'],
    value: 'symbols'
  }
];
