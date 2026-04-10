import i18n from 'utils/i18n';
export const DEFAULT_DEPOSIT_RULE = {
  accountGroups: '' /* id 逗号隔开 */,
  balanceLevelId: '',
  balanceType: 1,
  commissionType: 0,
  name: '',
  ruleType: 1,
  symbolGroups: '' /* id 逗号隔开 */,
  mt4Groups: [] /* {serverId:1,serverName:"MT4真实测试",groups:["EURUSD","AUDUSD"]}]} */ /* ["-1"]为未启用 */
};

export const RULE_HEADER = [
  { label: i18n['general.sort'], value: 'sort' },
  { label: i18n['settings.rebate_setting.rule_name'], value: 'name' },
  {
    label: i18n['settings.rebate_setting.commission_type'],
    value: 'commission_type'
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
export const OPERATERULE_HEADER = [
  { label: i18n['settings.rebate_setting.rule_name'], value: 'namet' },
  {
    label: i18n['settings.rebate_setting.commission_type'],
    value: 'commission_type'
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
    label: i18n['settings.rebate_setting.balance_unit'],
    value: 'balance_unit'
  },
  {
    label: i18n['settings.rebate_setting.balance_level'],
    value: 'balance_level'
  }
];
