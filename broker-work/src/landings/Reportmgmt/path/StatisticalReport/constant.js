import i18n from 'utils/i18n';
import { dateRange } from 'utils/config';

const defaultRanges = {
  [i18n['general.date_range_picker.option.today']]: dateRange.today,
  [i18n['general.date_range_picker.option.yestoday']]: dateRange.yestoday,
  [i18n['general.date_range_picker.option.last7days']]: dateRange.last7days,
  [i18n['general.date_range_picker.option.last30days']]: dateRange.last30days,
  [i18n['general.date_range_picker.option.currentMonth']]:
    dateRange.currentMonth,
  [i18n['general.date_range_picker.option.lastMonth']]: dateRange.lastMonth
};

const specialRanges = {
  [i18n['general.date_range_picker.option.all']]: dateRange.all,
  [i18n['general.date_range_picker.option.today']]: dateRange.today,
  [i18n['general.date_range_picker.option.yestoday']]: dateRange.yestoday,
  [i18n['general.date_range_picker.option.last7days']]: dateRange.last7days,
  [i18n['general.date_range_picker.option.last30days']]: dateRange.last30days,
  [i18n['general.date_range_picker.option.currentMonth']]:
    dateRange.currentMonth,
  [i18n['general.date_range_picker.option.lastMonth']]: dateRange.lastMonth
};

const REPORT_ADVANCED_SEARCH_CMD_OPTION = [
  {
    label: i18n['report.advanced_search_conditions.buy'],
    value: 'buy'
  },
  {
    label: i18n['report.advanced_search_conditions.sell'],
    value: 'sell'
  }
];
// mt5开平仓搜索字段
const OPEN_CLOSE_SEARCH_TYPE = [
  {
    label: i18n['report.history_order_Header.open'],
    value: 'open'
  },
  {
    label: i18n['report.history_order_Header.close'],
    value: 'close'
  }
];
//综合账户报表筛选条件
export const ACCOUNTSUMMARY_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true
  },
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.account_summary_Header.name'],
    value: 'name',
    fieldType: 'input',
    conditions: ['like'],
    key: 'name'
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userId',
    fieldType: 'user',
    conditions: ['equals'],
    default: true
  },
  {
    label: i18n['report.account_summary_Header.login'],
    value: 'login',
    fieldType: 'input',
    conditions: ['like'],
    key: 'login'
  },
  {
    label: i18n['report.account_summary_Header.d'],
    value: 'd',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'd'
  },
  {
    label: i18n['report.account_summary_Header.w'],
    value: 'w',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'w'
  },
  {
    label: i18n['report.account_summary_Header.commission'],
    value: 'commission',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'commission'
  },
  {
    label: i18n['report.account_summary_Header.storage'],
    value: 'storage',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'storage'
  },
  {
    label: i18n['report.account_summary_Header.profit'],
    value: 'profit',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'profit'
  },
  {
    label: i18n['report.account_summary_Header.ticket_count'],
    value: 'ticket_count',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'ticket_count'
  },
  {
    label: i18n['report.account_summary_Header.open_volume'],
    value: 'open_volume',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'open_volume'
  },
  {
    label: i18n['report.account_summary_Header.close_volume'],
    value: 'close_volume',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'close_volume'
  },
  {
    label: i18n['report.account_summary_Header.first_deposit_day'],
    value: 'first_deposit_day',
    fieldType: 'date',
    key: 'first_deposit_day',
    conditions: ['between'],
    rangeConditions: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.account_summary_Header.regdate'],
    value: 'regdate',
    fieldType: 'date',
    key: 'regdate',
    conditions: ['between'],
    rangeConditions: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.advanced_search_conditions.group'],
    value: 'group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  },
  {
    label: i18n['report.advanced_search_conditions.account_group'],
    value: 'account_group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  }
];

//综合账户报表表头
export const ACCOUNTSUMMARY_HEADER = [
  {
    label: i18n['report.account_summary_Header.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.account_summary_Header.login'],
    value: 'login',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.account_summary_Header.name'],
    value: 'name',
    fieldType: 'input'
  },
  {
    label: i18n['report.account_summary_Header.d'],
    value: 'd',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.account_summary_Header.w'],
    value: 'w',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.account_summary_Header.commission'],
    value: 'commission',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.account_summary_Header.storage'],
    value: 'storage',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.account_summary_Header.profit'],
    value: 'profit',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.account_summary_Header.ticket_count'],
    value: 'ticket_count',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.account_summary_Header.open_volume'],
    value: 'open_volume',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.account_summary_Header.close_volume'],
    value: 'close_volume',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.account_summary_Header.first_deposit_day'],
    value: 'first_deposit_day',
    sort: true,
    fieldType: 'date',
    rangeConditions: true
  },
  {
    label: i18n['report.account_summary_Header.regdate'],
    value: 'regdate',
    sort: true,
    fieldType: 'date',
    rangeConditions: true
  },
  {
    label: i18n['report.account_summary_Header.begin_equity'],
    value: 'begin_equity'
  },
  {
    label: i18n['report.account_summary_Header.end_equity'],
    value: 'end_equity'
  }
];

// 账户资金报表筛选条件
export const ACCOUNTDW_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true
  },
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.account_summary_Header.name'],
    value: 'name',
    fieldType: 'input',
    conditions: ['like'],
    key: 'name'
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userId',
    fieldType: 'user',
    conditions: ['equals'],
    default: true
  },
  {
    label: i18n['report.account_summary_Header.login'],
    value: 'login',
    fieldType: 'input',
    conditions: ['like'],
    key: 'login'
  },
  {
    label: i18n['report.account_summary_Header.d'],
    value: 'd',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'd'
  },
  {
    label: i18n['report.account_summary_Header.w'],
    value: 'w',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'w'
  },
  {
    label: i18n['report.account_dw_Header.change'],
    value: 'change',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'change'
  },
  {
    label: i18n['report.account_dw_Header.comment'],
    value: 'comment',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'like', 'not_like'],
    key: 'comment'
  },
  {
    label: i18n['report.advanced_search_conditions.group'],
    value: 'group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  },
  {
    label: i18n['report.advanced_search_conditions.account_group'],
    value: 'account_group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  }
];

//账户资金报表表头
export const ACCOUNTDW_HEADER = [
  {
    label: i18n['report.account_dw_Header.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.account_dw_Header.login'],
    value: 'login',
    fieldType: 'input'
  },
  {
    label: i18n['report.account_dw_Header.name'],
    value: 'name',
    fieldType: 'input'
  },
  {
    label: i18n['report.account_dw_Header.ticket'],
    value: 'ticket',
    fieldType: 'ticket'
  },
  {
    label: i18n['report.account_dw_Header.d'],
    value: 'd',
    fieldType: 'input',
    sort: true
  },
  {
    label: i18n['report.account_dw_Header.w'],
    value: 'w',
    fieldType: 'input',
    sort: true
  },
  {
    label: i18n['report.account_dw_Header.change'],
    value: 'change',
    fieldType: 'input'
  },
  {
    label: i18n['report.account_dw_Header.open_time'],
    value: 'open_time',
    fieldType: 'date',
    rangeConditions: true,
    sort: true
  },
  {
    label: i18n['report.account_dw_Header.comment'],
    value: 'comment',
    fieldType: 'input'
  }
];

//持仓查询筛选条件
export const POSITION_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true
  },
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    additions: { ranges: specialRanges }
  },
  {
    label: i18n['report.account_summary_Header.name'],
    value: 'name',
    fieldType: 'input',
    conditions: ['like'],
    key: 'name'
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userId',
    fieldType: 'user',
    conditions: ['equals'],
    default: true
  },
  {
    label: i18n['report.account_summary_Header.login'],
    value: 'login',
    fieldType: 'input',
    conditions: ['like'],
    key: 'login'
  },
  {
    label: i18n['report.position_Header.ticket'],
    value: 'ticket',
    fieldType: 'input',
    conditions: ['equals', 'like'],
    key: 'ticket'
  },
  {
    label: i18n['report.position_Header.cmd'],
    value: 'cmd',
    fieldType: 'select',
    conditions: ['equals'],
    key: 'cmd',
    optionList: REPORT_ADVANCED_SEARCH_CMD_OPTION
  },
  {
    label: i18n['report.position_Header.symbol'],
    value: 'symbol',
    fieldType: 'select',
    conditions: ['equals'],
    key: 'symbol',
    additions: {
      checkbox: true,
      searchable: true
    }
  },
  {
    label: i18n['report.position_Header.volume'],
    value: 'volume',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'volume'
  },
  {
    label: i18n['report.position_Header.open_price'],
    value: 'open_price',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'open_price'
  },
  {
    label: i18n['report.position_Header.open_time'],
    value: 'open_time',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.position_Header.sl'],
    value: 'sl',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.tp'],
    value: 'tp',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.commission'],
    value: 'commission',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.storage'],
    value: 'storage',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.profit'],
    value: 'profit',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.advanced_search_conditions.group'],
    value: 'group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  },
  {
    label: i18n['report.advanced_search_conditions.account_group'],
    value: 'account_group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  }
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
    additions: {
      checkbox: true,
      searchable: true
    }
  },
  {
    label: i18n['report.position_Header.volume'],
    value: 'volume',
    sort: true,
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.position_Header.open_price'],
    value: 'open_price',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.position_Header.open_time'],
    value: 'open_time',
    sort: true,
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
    fieldType: 'input'
  },
  {
    label: i18n['report.position_Header.tp'],
    value: 'tp',
    mt4: true,
    mt5: true,
    fieldType: 'input'
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
    fieldType: 'input'
  },
  {
    label: i18n['report.position_Header.profit'],
    value: 'profit',
    sort: true,
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.position_Header.margin_free'],
    value: 'margin_free',
    sort: true,
    mt4: true,
    mt5: true
  },
  {
    label: i18n['report.history_order_Header.comment'],
    value: 'comment',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  }
];
//挂单查询筛选条件
export const ORDER_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true
  },
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.account_summary_Header.name'],
    value: 'name',
    fieldType: 'input',
    conditions: ['like'],
    key: 'name'
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userId',
    fieldType: 'user',
    conditions: ['equals'],
    default: true
  },
  {
    label: i18n['report.account_summary_Header.login'],
    value: 'login',
    fieldType: 'input',
    conditions: ['like'],
    key: 'login'
  },
  {
    label: i18n['report.position_Header.ticket'],
    value: 'ticket',
    fieldType: 'input',
    conditions: ['equals', 'like'],
    key: 'ticket'
  },
  {
    label: i18n['report.position_Header.symbol'],
    value: 'symbol',
    fieldType: 'select',
    conditions: ['equals'],
    key: 'symbol',
    additions: {
      checkbox: true,
      searchable: true
    }
  },
  {
    label: i18n['report.position_Header.volume'],
    value: 'volume',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'volume'
  },
  {
    label: i18n['report.order_Header.open_price'],
    value: 'open_price',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'open_price'
  },
  {
    label: i18n['report.order_Header.open_time'],
    value: 'open_time',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.position_Header.sl'],
    value: 'sl',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.tp'],
    value: 'tp',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.advanced_search_conditions.group'],
    value: 'group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  },
  {
    label: i18n['report.advanced_search_conditions.account_group'],
    value: 'account_group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  }
];

//挂单查询表头
export const ORDER_HEADER = [
  {
    label: i18n['report.order_Header.parent_name'],
    value: 'parent_name',
    mt4: true,
    mt5: true
  },
  {
    label: i18n['report.order_Header.login'],
    value: 'login',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.order_Header.name'],
    value: 'name',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.order_Header.ticket'],
    value: 'ticket',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.order_Header.cmd'],
    value: 'cmd',
    mt4: true,
    mt5: true
  },
  {
    label: i18n['report.order_Header.symbol'],
    value: 'symbol',
    mt4: true,
    mt5: true,
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    }
  },
  {
    label: i18n['report.order_Header.volume'],
    value: 'volume',
    sort: true,
    mt4: true,
    mt5: false
  },
  {
    label: i18n['report.order_Header.mt5_volume'],
    value: 'volume',
    mt4: false,
    mt5: true,
    ctrader: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.order_Header.remain_volume'],
    value: 'remain_volume',
    mt4: false,
    mt5: true
  },
  {
    label: i18n['report.order_Header.open_price'],
    value: 'open_price',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.order_Header.open_time'],
    value: 'open_time',
    mt4: true,
    mt5: true,
    sort: true,
    fieldType: 'date',
    rangeConditions: true
  },
  {
    label: i18n['report.order_Header.sl'],
    value: 'sl',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.order_Header.tp'],
    value: 'tp',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.order_Header.close_time'],
    value: 'close_time',
    mt4: true,
    mt5: true
  }
];
//交易历史查询筛选条件
export const HISTORYORDER_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true
  },
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.account_summary_Header.name'],
    value: 'name',
    fieldType: 'input',
    conditions: ['like'],
    key: 'name'
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userId',
    fieldType: 'user',
    conditions: ['equals'],
    default: true
  },
  {
    label: i18n['report.account_summary_Header.login'],
    value: 'login',
    fieldType: 'input',
    conditions: ['like'],
    key: 'login'
  },
  {
    label: i18n['report.position_Header.ticket'],
    value: 'ticket',
    fieldType: 'input',
    conditions: ['equals', 'like'],
    key: 'ticket'
  },
  {
    label: i18n['report.position_Header.cmd'],
    value: 'cmd',
    conditions: ['equals'],
    key: 'cmd',
    fieldType: 'select',
    optionList: REPORT_ADVANCED_SEARCH_CMD_OPTION
  },
  {
    label: i18n['report.position_Header.symbol'],
    value: 'symbol',
    conditions: ['in', 'equals', 'not_equals'],
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    }
  },
  {
    label: i18n['report.position_Header.volume'],
    value: 'volume',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.close_time'],
    value: 'close_time',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.position_Header.sl'],
    value: 'sl',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.tp'],
    value: 'tp',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.commission'],
    value: 'commission',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.storage'],
    value: 'storage',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.profit'],
    value: 'profit',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.advanced_search_conditions.group'],
    value: 'group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['in']
  },
  {
    label: i18n['report.advanced_search_conditions.account_group'],
    value: 'account_group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['in']
  },
  {
    label: i18n['report.history_order_Header.open_close'],
    value: 'open_close',
    conditions: ['equals'],
    key: 'open_close',
    fieldType: 'select',
    optionList: OPEN_CLOSE_SEARCH_TYPE
  }
];

//交易历史查询表头

export const HISTORYORDER_HEADER = [
  {
    label: i18n['report.history_order_Header.parent_name'],
    value: 'userName',
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
    additions: {
      checkbox: true,
      searchable: true
    }
  },
  {
    label: i18n['report.history_order_Header.volume'],
    value: 'volume',
    sort: true,
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.open_price'],
    value: 'openPrice',
    mt4: true,
    mt5: false,
    ctrader: true
  },
  {
    label: i18n['report.history_order_Header.open_time'],
    value: 'openTime',
    mt4: true,
    sort: true,
    mt5: false,
    ctrader: true
  },
  {
    label: i18n['report.history_order_Header.close_price'],
    value: 'closePrice',
    mt4: true,
    mt5: false
  },
  {
    label: i18n['report.history_order_Header.mt5_open_price'],
    value: 'openPrice',
    mt4: false,
    mt5: true
  },
  {
    label: i18n['report.history_order_Header.close_time'],
    value: 'closeTime',
    mt4: true,
    sort: true,
    mt5: false
  },
  {
    label: i18n['report.history_order_Header.mt5_open_time'],
    value: 'openTime',
    sort: true,
    mt4: false,
    mt5: true
  },
  {
    label: i18n['report.history_order_Header.sl'],
    value: 'sl',
    mt4: true,
    mt5: false,
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.tp'],
    value: 'tp',
    mt4: true,
    mt5: false,
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.open_close'],
    value: 'openClose',
    mt4: false,
    mt5: true,
    fieldType: 'select'
  },
  {
    label: i18n['report.history_order_Header.positionId'],
    value: 'positionId',
    mt4: false,
    mt5: true,
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.commission'],
    value: 'commission',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.storage'],
    value: 'swap',
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.profit'],
    value: 'profit',
    sort: true,
    mt4: true,
    mt5: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.history_order_Header.comment'],
    value: 'comment',
    mt4: true,
    mt5: true
  }
  // {
  //   label: i18n['report.history_order_Header.extend'],
  //   value: 'extend',
  //   mt4: true,
  //   mt5: true
  // }
];
//止损止盈查询筛选条件
export const STOPLIMIT_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true
  },
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    additions: { ranges: specialRanges }
  },
  {
    label: i18n['report.account_summary_Header.name'],
    value: 'name',
    fieldType: 'input',
    conditions: ['like'],
    key: 'name'
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userId',
    fieldType: 'user',
    conditions: ['equals'],
    default: true
  },
  {
    label: i18n['report.account_summary_Header.login'],
    value: 'login',
    fieldType: 'input',
    conditions: ['like'],
    key: 'login'
  },
  {
    label: i18n['report.position_Header.ticket'],
    value: 'ticket',
    fieldType: 'input',
    conditions: ['equals', 'like'],
    key: 'ticket'
  },
  {
    label: i18n['report.position_Header.cmd'],
    value: 'cmd',
    conditions: ['equals'],
    key: 'cmd',
    fieldType: 'select',
    optionList: REPORT_ADVANCED_SEARCH_CMD_OPTION
  },
  {
    label: i18n['report.position_Header.symbol'],
    value: 'symbol',
    conditions: ['equals'],
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    }
  },
  {
    label: i18n['report.position_Header.volume'],
    value: 'volume',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    fieldType: 'input',
    key: 'volume'
  },
  {
    label: i18n['report.stop_loss_Header.open_price'],
    value: 'open_price',
    fieldType: 'input',
    conditions: ['equals'],
    key: 'open_price'
  },
  {
    label: i18n['report.position_Header.sl'],
    value: 'sl',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.tp'],
    value: 'tp',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.commission'],
    value: 'commission',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.storage'],
    value: 'storage',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.position_Header.profit'],
    value: 'profit',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.advanced_search_conditions.group'],
    value: 'group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  },
  {
    label: i18n['report.advanced_search_conditions.account_group'],
    value: 'account_group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  }
];

//止损止盈报表表头

export const STOPLIMIT_HEADER = [
  {
    label: i18n['report.stop_loss_Header.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.stop_loss_Header.login'],
    value: 'login',
    fieldType: 'input'
  },
  {
    label: i18n['report.stop_loss_Header.name'],
    value: 'name',
    fieldType: 'input'
  },
  {
    label: i18n['report.stop_loss_Header.ticket'],
    value: 'ticket',
    fieldType: 'input'
  },
  {
    label: i18n['report.stop_loss_Header.cmd'],
    value: 'cmd',
    fieldType: 'select'
  },
  {
    label: i18n['report.stop_loss_Header.symbol'],
    value: 'symbol',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    }
  },
  {
    label: i18n['report.stop_loss_Header.volume'],
    value: 'volume',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.stop_loss_Header.open_price'],
    value: 'open_price',
    fieldType: 'input'
  },
  {
    label: i18n['report.stop_loss_Header.open_time'],
    value: 'open_time',
    fieldType: 'date',
    sort: true,
    rangeConditions: true
  },
  {
    label: i18n['report.stop_loss_Header.sl'],
    value: 'sl',
    fieldType: 'input'
  },
  {
    label: i18n['report.stop_loss_Header.tp'],
    value: 'tp',
    fieldType: 'input'
  },
  {
    label: i18n['report.stop_loss_Header.commission'],
    value: 'commission',
    fieldType: 'input'
  },
  {
    label: i18n['report.stop_loss_Header.storage'],
    value: 'storage',
    fieldType: 'input'
  },
  {
    label: i18n['report.stop_loss_Header.profit'],
    value: 'profit',
    sort: true,
    fieldType: 'input'
  }
];
//品种查询筛选条件
export const SYMBOLGROUP_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true
  },
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userId',
    fieldType: 'user',
    conditions: ['equals'],
    default: true
  },
  {
    label: i18n['report.account_summary_Header.login'],
    value: 'login',
    fieldType: 'input',
    conditions: ['like'],
    key: 'login'
  },
  {
    label: i18n['report.symbol_Header.symbol_group'],
    value: 'symbol_group',
    fieldType: 'select',
    conditions: ['equals'],
    key: 'symbol_group'
  },
  {
    label: i18n['report.symbol_Header.close_volume'],
    value: 'close_volume',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'close_volume'
  },
  {
    label: i18n['report.symbol_Header.open_volume'],
    value: 'open_volume',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'open_volume'
  },
  {
    label: i18n['report.symbol_Header.commission'],
    value: 'commission',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'commission'
  },
  {
    label: i18n['report.symbol_Header.account_count'],
    value: 'account_count',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'account_count'
  },
  {
    label: i18n['report.history_order_Header.storage'],
    value: 'storage',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  },
  {
    label: i18n['report.history_order_Header.profit'],
    value: 'profit',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less']
  }
];

//品种佣金报表表头
export const SYMBOLGROUP_HEADER = [
  {
    label: i18n['report.symbol_Header.symbol_group'],
    value: 'symbol_group'
  },
  {
    label: i18n['report.symbol_Header.open_volume'],
    value: 'open_volume',
    fieldType: 'input'
  },
  {
    label: i18n['report.symbol_Header.close_volume'],
    value: 'close_volume',
    fieldType: 'input'
  },
  {
    label: i18n['report.symbol_Header.commission'],
    value: 'commission',
    fieldType: 'input'
  },
  {
    label: i18n['report.symbol_Header.account_count'],
    value: 'account_count',
    fieldType: 'input'
  },
  {
    label: i18n['report.symbol_Header.storage'],
    value: 'storage',
    fieldType: 'input'
  },
  {
    label: i18n['report.symbol_Header.profit'],
    value: 'profit',
    fieldType: 'input'
  },
  {
    label: i18n['report.lots_Header.action'],
    value: 'action'
  }
];

// 品种佣金报表明细
export const SYMBOLGROUP_DETAIL = [
  {
    label: i18n['report.symbol_detail.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.symbol_detail.login'],
    value: 'login'
  },
  {
    label: i18n['report.symbol_detail.open_volume'],
    value: 'open_volume'
  },
  {
    label: i18n['report.symbol_detail.close_volume'],
    value: 'close_volume'
  },
  {
    label: i18n['report.symbol_detail.name'],
    value: 'name'
  },
  {
    label: i18n['report.symbol_detail.symbol_group'],
    value: 'symbol_group'
  },
  {
    label: i18n['report.symbol_detail.commission'],
    value: 'commission'
  },
  {
    label: i18n['report.symbol_detail.storage'],
    value: 'storage'
  },
  {
    label: i18n['report.symbol_detail.profit'],
    value: 'profit'
  }
];

//新账户报表查询筛选条件
export const NEWUSER_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true
  },
  {
    label: i18n['report.download_tips_modal.belong'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.account_summary_Header.name'],
    value: 'name',
    fieldType: 'input',
    conditions: ['like'],
    key: 'name'
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userId',
    fieldType: 'user',
    conditions: ['equals'],
    default: true
  },
  {
    label: i18n['report.account_summary_Header.login'],
    value: 'login',
    fieldType: 'input',
    conditions: ['like'],
    key: 'login'
  },
  {
    label: i18n['report.new_user_Header.reg_date'],
    value: 'reg_date',
    fieldType: 'date',
    key: 'reg_date',
    conditions: ['between'],
    rangeConditions: true,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.new_user_Header.balance'],
    value: 'balance',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'balance'
  },
  {
    label: i18n['report.new_user_Header.float_p'],
    value: 'float_p',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'float_p'
  },
  {
    label: i18n['report.new_user_Header.equity'],
    value: 'equity',
    fieldType: 'input',
    conditions: ['equals', 'not_equals', 'big', 'less'],
    key: 'equity'
  },
  {
    label: i18n['report.advanced_search_conditions.group'],
    value: 'group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  },
  {
    label: i18n['report.advanced_search_conditions.account_group'],
    value: 'account_group',
    fieldType: 'select',
    additions: {
      checkbox: true,
      searchable: true
    },
    conditions: ['equals']
  }
];

//新账户报表表头
export const NEWUSER_HEADER = [
  {
    label: i18n['report.new_user_Header.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.new_user_Header.login'],
    value: 'login',
    fieldType: 'input'
  },
  {
    label: i18n['report.new_user_Header.name'],
    value: 'name',
    fieldType: 'input'
  },
  {
    label: i18n['report.new_user_Header.customer_source'],
    value: 'customer_source'
  },
  {
    label: i18n['report.account_summary_Header.first_deposit_day'],
    value: 'first_deposit_day'
  },
  {
    label: i18n['report.new_user_Header.reg_date'],
    value: 'reg_date',
    fieldType: 'date',
    sort: true,
    rangeConditions: true
  },
  {
    label: i18n['report.new_user_Header.balance'],
    value: 'balance',
    sort: true,
    fieldType: 'input'
  },
  {
    label: i18n['report.new_user_Header.float_p'],
    value: 'float_p',
    fieldType: 'input'
  },
  {
    label: i18n['report.new_user_Header.equity'],
    value: 'equity',
    sort: true,
    fieldType: 'input'
  }
];
export const ADVANCED_SEARCH_CONFIG = {
  searchType: 'BW_REPORT',
  arraySplit: '@#$', //数组分隔符
  fieldKey: 'key',
  conditionKey: 'type',
  dateFormat: 'YYYY-MM-DD' // 时间分隔符
};

export const REPORT_SORT_INTIAL = [
  {
    type: 'AccountSummary',
    sortColumn: 'regdate',
    label: i18n['report.account_summary_Header.regdate']
  },
  {
    type: 'AccountDw',
    sortColumn: 'open_time',
    label: i18n['report.account_dw_Header.open_time']
  },
  {
    type: 'Position',
    sortColumn: 'open_time',
    label: i18n['report.position_Header.open_time']
  },
  {
    type: 'Order',
    sortColumn: 'open_time',
    label: i18n['report.order_Header.open_time']
  },
  {
    type: 'HistoryOrder',
    MT4sortColumn: 'close_time',
    MT5sortColumn: 'open_time',
    MT4label: i18n['report.history_order_Header.close_time'],
    MT5label: i18n['report.history_order_Header.mt5_open_time']
  },
  {
    type: 'StopLimit',
    sortColumn: 'open_time',
    label: i18n['report.stop_loss_Header.open_time']
  },
  {
    type: 'NewUser',
    sortColumn: 'reg_date',
    label: i18n['report.new_user_Header.reg_date']
  }
];

export const MTG_RIGHTS = [
  'ACCOUNT_SELECT_DIRECTLY_MTG',
  'ACCOUNT_SELECT_SUBORDINATE_MTG',
  'ACCOUNT_SELECT_WILD_MTG',
  'ACCOUNT_SELECT_ALL_MTG'
];

export const GRP_RIGHTS = [
  'ACCOUNT_SELECT_DIRECTLY_GRP',
  'ACCOUNT_SELECT_SUBORDINATE_GRP',
  'ACCOUNT_SELECT_WILD_GRP',
  'ACCOUNT_SELECT_ALL_GRP'
];

// 新版报表
export const NEW_REPORTTYPE_FILTER = {
  HistoryOrder: 'TRADING_HISTORY_REPORT'
};

const TableType = {
  ACCOUNTSUMMARY_ADVANCED_SEARCH_TYPE,
  ACCOUNTSUMMARY_HEADER,
  ACCOUNTDW_HEADER,
  POSITION_ADVANCED_SEARCH_TYPE,
  POSITION_HEADER,
  ACCOUNTDW_ADVANCED_SEARCH_TYPE,
  ORDER_ADVANCED_SEARCH_TYPE,
  ORDER_HEADER,
  HISTORYORDER_ADVANCED_SEARCH_TYPE,
  HISTORYORDER_HEADER,
  SYMBOLGROUP_HEADER,
  SYMBOLGROUP_ADVANCED_SEARCH_TYPE,
  STOPLIMIT_ADVANCED_SEARCH_TYPE,
  STOPLIMIT_HEADER,
  NEWUSER_ADVANCED_SEARCH_TYPE,
  NEWUSER_HEADER,
  NEW_REPORTTYPE_FILTER
};
export default TableType;
