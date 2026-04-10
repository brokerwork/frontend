import i18n from 'utils/i18n';

//文章列表字段
export const ARTICLE_COLUMNS = [
  { label: i18n['runmgmt.app_content.article.table.order'], value: 'order' },
  { label: i18n['runmgmt.app_content.article.table.thumb'], value: 'image' },
  { label: i18n['runmgmt.app_content.article.table.title'], value: 'title' },
  {
    label: i18n['runmgmt.app_content.article.table.lastUpdate'],
    value: 'lastUpdate'
  },
  {
    label: i18n['runmgmt.app_content.article.table.operation'],
    value: 'operation'
  }
];

//栏目列表字段
export const COLUMN_COLUMNS = [
  { label: '', value: 'actions' },
  { label: i18n['runmgmt.app_content.column.table.order'], value: 'order' },
  { label: i18n['runmgmt.app_content.column.table.name'], value: 'name' },
  { label: i18n['runmgmt.app_content.column.table.status'], value: 'status' },
  {
    label: i18n['runmgmt.app_content.column.table.operation'],
    value: 'operation'
  }
];

//信号源列表字段
export const FOLLOW_COLUMNS = [
  { label: i18n['runmgmt.source_setting.table.name'], value: 'name' },
  { label: i18n['runmgmt.source_setting.table.id'], value: 'id' },
  { label: i18n['runmgmt.source_setting.table.login'], value: 'login' },
  {
    label: i18n['runmgmt.source_setting.table.state'],
    value: 'state'
  },
  {
    label: i18n['runmgmt.source_setting.table.type'],
    value: 'type'
  },
  {
    label: i18n['runmgmt.source_setting.table.balance'],
    value: 'balance'
  },
  {
    label: i18n['runmgmt.source_setting.table.profit'],
    value: 'profit'
  },
  {
    label: i18n['runmgmt.source_setting.table.profitRate'],
    value: 'profitRate'
  },
  {
    label: i18n['runmgmt.source_setting.table.avgTradeDayCount'],
    value: 'avgTradeDayCount'
  },
  {
    label: i18n['runmgmt.source_setting.table.avgPositionTime'],
    value: 'avgPositionTime'
  },
  {
    label: i18n['runmgmt.source_setting.table.tradeCycle'],
    value: 'tradeCycle'
  },
  {
    label: i18n['runmgmt.source_setting.table.tradeCount'],
    value: 'tradeCount'
  },
  {
    label: i18n['runmgmt.source_setting.table.tradeVolume'],
    value: 'tradeVolume'
  },
  {
    label: i18n['runmgmt.source_setting.table.strategy'],
    value: 'strategy'
  },
  {
    label: i18n['general.control'],
    value: 'control'
  }
];

export const SOURCE_HEADER = [
  { label: i18n['runmgmt.source_setting.table.name'], value: 'name' },
  { label: i18n['runmgmt.source_setting.table.id'], value: 'id' },
  { label: i18n['runmgmt.source_setting.table.login'], value: 'login' },
  { label: i18n['runmgmt.source_setting.table.state'], value: 'state' },
  { label: i18n['runmgmt.source_setting.table.type'], value: 'type' },
  { label: i18n['runmgmt.source_setting.table.balance'], value: 'balance' },
  { label: i18n['runmgmt.source_setting.table.profit'], value: 'profit' },
  {
    label: i18n['runmgmt.source_setting.table.profitRate'],
    value: 'profitRate'
  },
  {
    label: i18n['runmgmt.source_setting.table.avgTradeDayCount'],
    value: 'avgTradeDayCount'
  },
  {
    label: i18n['runmgmt.source_setting.table.avgPositionTime'],
    value: 'avgPositionTime'
  },
  {
    label: i18n['runmgmt.source_setting.table.tradeCycle'],
    value: 'tradeCycle'
  },
  {
    label: i18n['runmgmt.source_setting.table.tradeCount'],
    value: 'tradeCount'
  },
  {
    label: i18n['runmgmt.source_setting.table.tradeVolume'],
    value: 'tradeVolume'
  },
  {
    label: i18n['runmgmt.source_setting.table.strategy'],
    value: 'strategy'
  },
  {
    label: i18n['general.control'],
    value: 'actions'
  }
];
