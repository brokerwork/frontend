import i18n from 'utils/i18n';
export const DEFAULT_RULE = {
  accountGroups: '' /* id 逗号隔开 */,
  balanceLevelId: '',
  balanceType: 1,
  balanceUnit: 0,
  commissionType: 0,
  name: '',
  ruleType: 5,
  symbolGroups: '' /* id 逗号隔开 */,
  mt4Groups: [] /* {serverId:1,serverName:"MT4真实测试",groups:["EURUSD","AUDUSD"]}]} */ /* ["-1"]为未启用 */
};

// 可用的serverSymbol的vender标识列表
export const SERVERGROUPFILTER = [
  {
    vendor: 'MT4',
    enable: true
  },
  {
    vendor: 'MT5',
    enable: true,
    title: i18n['settings.rebate_setting.not_suport_for_now']
  }
];

// 可用的Balance
export const BALANCETYPEFILTER = [
  { label: i18n['report.real_Time_Commisson_Header.commission'], value: 1 }
];
export const BALANCEUNITSFILTER = [{ label: '%', value: 0 }];

export const RETURN_HEADER = [
  { label: i18n['general.sort'], value: 'sort' },
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
  },
  {
    label: i18n['settings.rebate_setting.user_count'],
    value: 'userCount'
  },
  {
    label: i18n['settings.rebate_setting.action'],
    value: 'action'
  }
];

export const RETURN_OPERATE_HEADER = [
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
