import i18n from 'utils/i18n';
export const DEFAULT_RULE = {
  accountGroups: '' /* id 逗号隔开 */,
  balanceLevelId: '',
  balanceType: 0,
  balanceUnit: 0,
  commissionType: 0,
  name: '',
  ruleType: 0,
  symbolGroups: '' /* id 逗号隔开 */,
  mt4Groups: [] /* {serverId:1,serverName:"MT4真实测试",groups:["EURUSD","AUDUSD"]}]} */ /* ["-1"]为未启用 */
};

export const TRANSACTION_RULE_HEADER = [
  { label: i18n['general.sort'], value: 'sort' },
  {
    label: i18n['settings.rebate_setting.rule_name'],
    value: 'name'
  },
  {
    label: i18n['settings.rebate_setting.mt_group'],
    value: 'mt_group'
  },
  {
    label: i18n['settings.rebate_setting.account_group'],
    value: 'account_group'
  },
  {
    label: i18n['settings.rebate_setting.symbol_group'],
    value: 'symbol_group'
  },
  {
    label: i18n['settings.rebate_setting.balance_type'],
    value: 'balance_type'
  },
  {
    label: i18n['settings.rebate_setting.balance_unit'],
    value: 'balance_unit'
  },
  {
    label: i18n['settings.rebate_setting.balance_level'],
    value: 'balance_level'
  },
  {
    label: i18n['settings.rebate_setting.user_count'],
    value: 'userCount'
  },
  {
    label: i18n['settings.rebate_setting.action'],
    value: 'action',
    fixed: 'right'
  }
];

export const PVMAP_HEADER = [
  { label: i18n['settings.rebate_setting.pvmap_rule'], value: 'rule' },
  {
    label: i18n['settings.rebate_setting.pvmap_balance_type'],
    value: 'balance_type'
  },
  {
    label: i18n['settings.rebate_setting.transaction_symbol'],
    value: 'symbol'
  },
  {
    label: i18n['settings.rebate_setting.action'],
    value: 'action'
  }
];

export const OPERATE_RULE_HEADER = [
  { label: i18n['settings.rebate_setting.rule_name'], value: 'name' },
  {
    label: i18n['settings.rebate_setting.symbol_group'],
    value: 'symbol_group'
  },
  {
    label: i18n['settings.rebate_setting.account_group'],
    value: 'account_group'
  },
  {
    label: i18n['settings.rebate_setting.mt_group'],
    value: 'mt_group'
  },
  {
    label: i18n['settings.rebate_setting.balance_type'],
    value: 'balance_type'
  },
  {
    label: i18n['settings.rebate_setting.balance_unit'],
    value: 'balance_unit'
  },
  {
    label: i18n['settings.rebate_setting.balance_level'],
    value: 'balance_level'
  }
];
