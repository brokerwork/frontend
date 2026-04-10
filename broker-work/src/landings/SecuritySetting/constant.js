import i18n from 'utils/i18n';

export const GENDER_TYPE = [
  { label: i18n['user_setting.basic_info.man'], value: '1' },
  { label: i18n['user_setting.basic_info.woman'], value: '0' }
];

export const COUNTRY_PROVINCE_CITY_KEY = 'countryProvinceCity';

//默认搜索字段
export const DEFAULT_SEARCH_TYPE = [
  { label: i18n['report.search_type.account_name'], value: 'AccountName' },
  { label: i18n['report.search_type.account_no'], value: 'AccountNo' },
  { label: i18n['report.search_type.order_no'], value: 'OrderNo' }
];

//持仓查询表头
export const POSITION_HEADER = [
  {
    label: i18n['report.position_Header.parent_name'],
    value: 'parent_name',
    mt4: true,
    mt5: true
  },
  {
    label: i18n['report.position_Header.login'],
    value: 'login',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.position_Header.name'],
    value: 'name',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.position_Header.customer_name'],
    value: 'customer_name',
    mt4: true,
    mt5: true,
    fieldType: 'customer'
  },
  {
    label: i18n['report.position_Header.ticket'],
    value: 'ticket',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.position_Header.cmd'],
    value: 'cmd',
    mt4: true,
    mt5: true,
    fieldType: 'select'
  },
  {
    label: i18n['report.position_Header.symbol'],
    value: 'symbol',
    mt4: true,
    mt5: true,
    fieldType: 'select',
    additions: { checkbox: true, searchable: true }
  },
  {
    label: i18n['report.position_Header.volume'],
    value: 'volume',
    sort: true,
    mt4: true,
    mt5: true,
    fieldType: 'number'
  },
  {
    label: i18n['report.position_Header.open_price'],
    value: 'open_price',
    mt4: true,
    mt5: true,
    fieldType: 'number'
  },
  {
    label: i18n['report.position_Header.open_time'],
    value: 'open_time',
    mt4: true,
    mt5: true,
    fieldType: 'date',
    rangeConditions: true
  },
  {
    label: i18n['report.position_Header.sl'],
    value: 'sl',
    mt4: true,
    mt5: true,
    fieldType: 'number'
  },
  {
    label: i18n['report.position_Header.tp'],
    value: 'tp',
    mt4: true,
    mt5: true,
    fieldType: 'number'
  },
  {
    label: i18n['report.position_Header.commission'],
    value: 'commission',
    mt4: true,
    mt5: false
  },
  {
    label: i18n['report.position_Header.storage'],
    value: 'storage',
    mt4: true,
    mt5: true,
    fieldType: 'number'
  },
  {
    label: i18n['report.position_Header.profit'],
    value: 'profit',
    sort: true,
    mt4: true,
    mt5: true,
    fieldType: 'number'
  },
  {
    label: i18n['report.position_Header.margin_free'],
    value: 'margin_free',
    mt4: true,
    mt5: true
  }
];

//交易历史查询表头

export const HISTORYORDER_HEADER = [
  {
    label: i18n['report.history_order_Header.parent_name'],
    value: 'parent_name',
    mt4: true,
    mt5: true
  },
  {
    label: i18n['report.history_order_Header.login'],
    value: 'login',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.name'],
    value: 'name',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.customer_name'],
    value: 'customer_name',
    mt4: true,
    mt5: true,
    fieldType: 'customer'
  },
  {
    label: i18n['report.history_order_Header.ticket'],
    value: 'ticket',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.cmd'],
    value: 'cmd',
    mt4: true,
    mt5: true,
    fieldType: 'select'
  },
  {
    label: i18n['report.history_order_Header.symbol'],
    value: 'symbol',
    mt4: true,
    mt5: true,
    fieldType: 'select',
    additions: { checkbox: true, searchable: true }
  },
  {
    label: i18n['report.history_order_Header.volume'],
    value: 'volume',
    sort: true,
    mt4: true,
    mt5: true,
    fieldType: 'number'
  },
  {
    label: i18n['report.history_order_Header.open_price'],
    value: 'open_price',
    mt4: true,
    mt5: false
  },
  {
    label: i18n['report.history_order_Header.open_time'],
    value: 'open_time',
    mt4: true,
    mt5: false
  },
  {
    label: i18n['report.history_order_Header.close_price'],
    value: 'close_price',
    mt4: true,
    mt5: false
  },
  {
    label: i18n['report.history_order_Header.mt5_open_price'],
    value: 'open_price',
    mt4: false,
    mt5: true
  },
  {
    label: i18n['report.history_order_Header.close_time'],
    value: 'close_time',
    mt4: true,
    mt5: false
  },
  {
    label: i18n['report.history_order_Header.mt5_open_time'],
    value: 'open_time',
    mt4: false,
    mt5: true
  },
  {
    label: i18n['report.history_order_Header.sl'],
    value: 'sl',
    mt4: true,
    mt5: false,
    fieldType: 'number'
  },
  {
    label: i18n['report.history_order_Header.tp'],
    value: 'tp',
    mt4: true,
    mt5: false,
    fieldType: 'number'
  },
  {
    label: i18n['report.history_order_Header.open_close'],
    value: 'open_close',
    mt4: false,
    mt5: true
  },
  {
    label: i18n['report.history_order_Header.commission'],
    value: 'commission',
    mt4: true,
    mt5: true,
    fieldType: 'number'
  },
  {
    label: i18n['report.history_order_Header.storage'],
    value: 'storage',
    mt4: true,
    mt5: true,
    fieldType: 'number'
  },
  {
    label: i18n['report.history_order_Header.profit'],
    value: 'profit',
    sort: true,
    mt4: true,
    mt5: true,
    fieldType: 'number'
  },
  {
    label: i18n['report.history_order_Header.comment'],
    value: 'comment',
    mt4: true,
    mt5: true
  },
  {
    label: i18n['report.history_order_Header.extend'],
    value: 'extend',
    mt4: true,
    mt5: true
  }
];

export const PROFIT_HEADER = [
  {
    label: i18n['user_setting.agent_deposit.profit_header.login'],
    value: 'userLogin'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_header.order_no'],
    value: 'ticket'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_header.trader_no'],
    value: 'login'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_header.name'],
    value: 'userName'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_header.close_time'],
    value: 'closeTime'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_header.status'],
    value: 'status'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_header.deal_time'],
    value: 'handleTime'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_header.money'],
    value: 'agentProfit'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_header.action'],
    value: 'action'
  }
];

export const PROFIT_STATUS = [
  {
    label: i18n['user_setting.agent_deposit.profit_status.all'],
    value: 'all'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_status.success'],
    value: '1'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_status.processing'],
    value: '2'
  },
  {
    label: i18n['user_setting.agent_deposit.profit_status.failed'],
    value: '0'
  }
];

export const CTRADER_NOSHOW_TYPE = ['storage', 'float_p', 'change', 'profit'];

export const ADVANCED_SEARCH_CONFIG = {
  searchType: 'BW_REPORT',
  fieldKey: 'key',
  conditionKey: 'type',
  dateFormat: 'YYYY-MM-DD', // 时间分隔符
  rangeSplit: '-'
};

export const REPORT_ADVANCED_SEARCH_CMD_OPTION = [
  { label: i18n['report.advanced_search_conditions.buy'], value: 'buy' },
  { label: i18n['report.advanced_search_conditions.sell'], value: 'sell' }
];

// 报表高级筛选条件
export const REPORT_ADVANCED_SEARCH_CONDITIONS = [
  { label: i18n['report.advanced_search_conditions.equals'], value: 'equals' },
  {
    label: i18n['report.advanced_search_conditions.not_equals'],
    value: 'not_equals'
  },
  { label: i18n['report.advanced_search_conditions.big'], value: 'big' },
  { label: i18n['report.advanced_search_conditions.less'], value: 'less' },
  { label: i18n['report.advanced_search_conditions.like'], value: 'like' },
  {
    label: i18n['report.advanced_search_conditions.not_like'],
    value: 'not_like'
  },
  { label: i18n['report.advanced_search_conditions.between'], value: 'between' }
];

// 报表高级搜索额外字段
export const REPORT_ADVANCED_SEARCH_CONDITIONS_EXTRA_FIELD = [
  {
    label: i18n['report.advanced_search_conditions.group'],
    value: 'group',
    fieldType: 'select',
    additions: { checkbox: true, searchable: true },
    conditions: ['equals']
  },
  {
    label: i18n['report.advanced_search_conditions.account_group'],
    value: 'account_group',
    fieldType: 'select',
    additions: { checkbox: true, searchable: true },
    conditions: ['equals']
  }
];

export const BASIC_INFO_COLUMNS = [
  { laebl: i18n['user_setting.basic_info.entity_no_label'], key: 'entityNo' },
  { laebl: i18n['user_setting.basic_info.user_name_label'], key: 'username' },
  { laebl: i18n['user_setting.basic_info.real_name_label'], key: 'name' },
  { laebl: i18n['user_setting.basic_info.header_img_label'], key: 'headImage' },
  { laebl: i18n['user_setting.basic_info.phone_label'], key: 'phones' },
  { laebl: i18n['user_setting.basic_info.email_label'], key: 'email' },
  { laebl: i18n['user_setting.basic_info.gender_label'], key: 'sex' },
  { laebl: i18n['user_setting.basic_info.birthday_label'], key: 'birthday' },
  {
    laebl: i18n['user_setting.basic_info.server_label'],
    key: 'vendorServerId'
  },
  { laebl: i18n['user_setting.basic_info.account_info_label'], key: 'login' },
  { laebl: i18n['user_setting.basic_info.address_label'], key: 'region' },
  {
    laebl: i18n['user_setting.basic_info.detail_address_label'],
    key: 'address'
  },
  { laebl: i18n['user_setting.basic_info.self_intro_label'], key: 'comment' }
];
