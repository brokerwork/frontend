import i18n from 'utils/i18n';
export const DEFAULT_DISTRIBUTION_RULE = {
  accountGroups: '' /* id 逗号隔开 */,
  balanceLevelId: '',
  balanceType: 0,
  balanceUnit: 0,
  commissionType: 0,
  cycleLevel: 1,
  name: '',
  ruleType: 2,
  symbolGroups: '' /* id 逗号隔开 */,
  mt4Groups: [] /* {serverId:1,serverName:"MT4真实测试",groups:["EURUSD","AUDUSD"]}]} */ /* ["-1"]为未启用 */
};

// 可用的serverSymbol的vender标识列表
export const SERVERGROUPFILTER = [{
  vendor: 'MT4',
  enable: true
},{
  vendor: 'MT5',
  enable: false,
  title: i18n['settings.rebate_setting.not_suport_for_now']
}];
