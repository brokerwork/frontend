import i18n from 'utils/i18n';
import { dateRange } from 'utils/config';

const defaultRanges = {
  [i18n['general.date_range_picker.option.all']]: dateRange.all,
  [i18n['general.date_range_picker.option.today']]: dateRange.today,
  [i18n['general.date_range_picker.option.yestoday']]: dateRange.yestoday,
  [i18n['general.date_range_picker.option.last7days']]: dateRange.last7days,
  [i18n['general.date_range_picker.option.last30days']]: dateRange.last30days,
  [i18n['general.date_range_picker.option.currentMonth']]:
    dateRange.currentMonth,
  [i18n['general.date_range_picker.option.lastMonth']]: dateRange.lastMonth
};

// 佣金报表 交易返佣报表表头
export const LOTSNEW_HEADER = [
  {
    label: i18n['report.lots_Header.commission_user'],
    value: 'userName'
  },
  {
    label: i18n['report.lots_Header.commission_user_login'],
    value: 'userLogin'
  },
  {
    label: i18n['report.lots_Header.rebate_money'],
    value: 'rebateMoney'
  },
  {
    label: i18n['report.lots_Header.login'],
    value: 'login'
  },
  {
    label: i18n['report.lots_Header.name'],
    value: 'name'
  },
  {
    label: i18n['report.lots_Header.parent_name'],
    value: 'accountOwnerName'
  },
  {
    label: i18n['report.lots_Header.ticket'],
    value: 'ticket'
  },
  {
    label: i18n['report.lots_Header.symbol'],
    value: 'symbol'
  },
  {
    label: i18n['report.lots_Header.volume'],
    value: 'volume'
  },
  // 手续费
  {
    label: i18n['report.lots_Detail_modal.commission_label'],
    value: 'commission'
  },
  // 隔夜利息
  {
    label: i18n['report.lots_Detail_modal.storage'],
    value: 'swap'
  },
  // 盈亏
  {
    label: i18n['report.lots_Detail_modal.profit'],
    value: 'profit'
  },
  {
    label: i18n['report.lots_Header.open_time'],
    value: 'openTime'
  },
  {
    label: i18n['report.lots_Header.close_time'],
    value: 'closeTime'
  },
  {
    label: i18n['report.lots_Header.rule_description1'],
    value: 'ruleDescription1'
  },
  {
    label: i18n['report.lots_Header.rule_description2'],
    value: 'ruleDescription2'
  }
];

// 佣金报表 交易返佣报表筛选条件
export const LOTSNEW_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.download_object'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    mainFilter: true
  },
  {
    label: i18n['report.download_tips_modal.download_object'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    mainFilter: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.close_time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    index: 3,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  }
  // {
  //   label: i18n['report.download_tips_modal.download_object'],
  //   value: 'userId',
  //   fieldType: 'user',
  //   conditions: ['equals'],
  //   default: true
  // }
];
// 佣金报表 交易返佣查询表头
export const LOTSNEWSEARCH_HEADER = [
  {
    label: i18n['report.lots_Header.commission_user'],
    value: 'rebateUserName'
  },
  {
    label: i18n['report.lots_Header.commission_user_login'],
    value: 'rebateLogin'
  },
  {
    label: i18n['report.lots_Header.rebate_money'],
    value: 'rebateMoney'
  },
  {
    label: i18n['report.lots_Header.login'],
    value: 'accountId'
  },
  {
    label: i18n['report.lots_Header.name'],
    value: 'accountName'
  },
  {
    label: i18n['report.lots_Header.parent_name'],
    value: 'accountOwnerName'
  },
  {
    label: i18n['report.lotsNewSearch_header.sumary_hands'],
    value: 'volume'
  }
  // {
  //   label: i18n['report.lotsNewSearch_header.sumary_handles'],
  //   value: 'handleAmount'
  // }
];
// 佣金报表 交易返佣查询条件
// 新版使用
// EQ,//等于
// NEQ,//不等于
// REGEX,
// CONTAIN,//包含
// IN,//存在
// NIN,
// BETWEEN,
// GT,//大于
// GTE,//大于等于
// LT,//小于
// LTE,//小于等于
// EMPTY//为空
export const LOTSNEWSEARCH_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.download_object'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['EQ'],
    mainFilter: true,
    additions: { showDirect: false }
  },
  {
    label: i18n['report.download_tips_modal.download_object'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['EQ'],
    mainFilter: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.close_time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    index: 3,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  {
    label: i18n['report.lotsNewSearch_condition.data_range'],
    value: 'scope',
    fieldType: 'select',
    conditions: ['BETWEEN'],
    key: 'scope'
  }
];
// 佣金报表 入金返佣报表表头
export const DEPOSIT_HEADER = [
  {
    label: i18n['report.lots_Header.commission_name'],
    value: 'commission_user'
  },
  {
    label: i18n['report.deposit_Header.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.deposit_Header.login'],
    value: 'login'
  },
  {
    label: i18n['report.deposit_Header.name'],
    value: 'name'
  },
  // {
  //   label: i18n['report.deposit_Header.customer_name'],
  //   value: 'customer_name'
  // },
  {
    label: i18n['report.deposit_Header.lots_money'],
    value: 'lots_money'
  },
  {
    label: i18n['report.deposit_Header.row_heji'],
    value: 'row_heji'
  }
];

// 佣金报表 净入金返佣报表表头
export const NETDEPOSIT_HEADER = [
  {
    label: i18n['report.lots_Header.commission_name'],
    value: 'commission_user'
  },
  {
    label: i18n['report.net_deposit_Header.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.net_deposit_Header.login'],
    value: 'login'
  },
  {
    label: i18n['report.net_deposit_Header.name'],
    value: 'name'
  },
  // {
  //   label: i18n['report.net_deposit_Header.customer_name'],
  //   value: 'customer_name'
  // },
  {
    label: i18n['report.net_deposit_Header.lots_money'],
    value: 'lots_money'
  },
  {
    label: i18n['report.net_deposit_Header.row_heji'],
    value: 'row_heji'
  }
];

// 佣金报表 盈利分成返佣报表表头
export const PROFIT_HEADER = [
  {
    label: i18n['report.lots_Header.commission_name'],
    value: 'commission_user'
  },
  {
    label: i18n['report.profit_Header.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.profit_Header.login'],
    value: 'login'
  },
  {
    label: i18n['report.profit_Header.name'],
    value: 'name'
  },
  {
    label: i18n['report.profit_Header.lots_money'],
    value: 'lots_money'
  },
  {
    label: i18n['report.profit_Header.row_heji'],
    value: 'row_heji'
  }
];
// 佣金报表 净盈利分成返佣报表表头
export const NETPROFIT_HEADER = [
  {
    label: i18n['report.lots_Header.commission_name'],
    value: 'commission_user'
  },
  {
    label: i18n['report.profit_Header.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.profit_Header.login'],
    value: 'login'
  },
  {
    label: i18n['report.profit_Header.name'],
    value: 'name'
  },
  {
    label: i18n['report.net_profit_Header.lots_money'],
    value: 'lots_money'
  },
  {
    label: i18n['report.profit_Header.row_heji'],
    value: 'row_heji'
  }
];
// 手续费分成返佣报表表头
export const COMMISSIONCHARGE_HEADER = [
  {
    label: i18n['report.commission_charge_Header.commission_name'],
    value: 'commission_user'
  },
  {
    label: i18n['report.lots_Header.commission_user_login'],
    value: 'commission_user_login'
  },
  {
    label: i18n['report.lots_Header.rebate_money'],
    value: 'rebate_money'
  },
  {
    label: i18n['report.commission_charge_Header.login'],
    value: 'login'
  },
  {
    label: i18n['report.commission_charge_Header.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.commission_charge_Header.name'],
    value: 'name'
  },
  {
    label: i18n['report.lots_Header.ticket'],
    value: 'ticket'
  },
  {
    label: i18n['report.lots_Header.symbol'],
    value: 'symbol'
  },
  {
    label: i18n['report.lots_Header.volume'],
    value: 'volume'
  },
  // 手续费
  {
    label: i18n['report.lots_Detail_modal.commission_label'],
    value: 'commission'
  },
  {
    label: i18n['report.lots_Header.open_time'],
    value: 'open_time'
  },
  {
    label: i18n['report.lots_Header.close_time'],
    value: 'close_time'
  }
];

// 佣金报表 净入金／盈利／手续费分成返佣报表筛选条件
export const COMMON_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.download_object'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    mainFilter: true
  },
  {
    label: i18n['report.download_tips_modal.download_object'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    mainFilter: true,
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
  }
  // {
  //   label: i18n['report.download_tips_modal.download_object'],
  //   value: 'userId',
  //   fieldType: 'user',
  //   conditions: ['equals'],
  //   default: true
  // }
];

// 佣金报表 按天返佣报表表头
export const REALTIME_HEADER = [
  {
    label: i18n['report.real_Time_Header.user_name'],
    value: 'commission_user'
  },
  {
    label: i18n['report.real_Time_Header.rebate_type'],
    value: 'rebate_type'
  },
  {
    label: i18n['report.real_Time_Header.level_name'],
    value: 'level_name'
  },
  {
    label: i18n['report.real_Time_Header.login'],
    value: 'login'
  },
  {
    label: i18n['report.real_Time_Header.vendor_type'],
    value: 'vendor_type'
  },
  {
    label: i18n['report.real_Time_Header.commission_date'],
    value: 'commission_date'
  },
  {
    label: i18n['report.real_Time_Header.close_volume'],
    value: 'close_volume'
  },
  {
    label: i18n['report.real_Time_Header.commission_value'],
    value: 'commission_value'
  },
  {
    label: i18n['report.real_Time_Header.status'],
    value: 'status'
  }
];

// 佣金报表 按天返佣报表筛选条件
export const REALTIME_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.download_object'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
    unique: true
  },
  {
    label: i18n['report.download_tips_modal.download_object'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['equals'],
    default: true,
    mainFilter: true,
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
    index: 3,
    additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
  },
  // {
  //   label: i18n['report.download_tips_modal.download_object'],
  //   value: 'userId',
  //   fieldType: 'user',
  //   conditions: ['equals'],
  //   default: true
  // },
  {
    label: i18n['report.real_Time_Header.status'],
    value: 'status',
    fieldType: 'select',
    conditions: ['equals'],
    key: 'status'
  },
  {
    label: i18n['report.real_Time_Header.rebate_type'],
    value: 'rebate_type',
    fieldType: 'select',
    conditions: ['equals'],
    key: 'rebate_type'
  }
];

// 佣金报表 实时返佣报表表头
export const RTCOMMISSION_HEADER = [
  {
    label: i18n['report.real_Time_Header.rebate_type'],
    value: 'rebateType'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.vendor_type'],
    value: 'vendor'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.user_name'],
    value: 'rebateUserName'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.commission_user_login'],
    value: 'rebateLogin'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.commission_value'],
    value: 'rebateMoney'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.commission_no'],
    value: 'accountId'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.accountName'],
    value: 'accountName'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.user'],
    value: 'accountOwnerName'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.order_no'],
    value: 'ticket'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.symbol'],
    value: 'symbol'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.volume'],
    value: 'volume'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.commission'],
    value: 'commission'
  },
  {
    label: i18n['report.history_order_Header.open_time'],
    value: 'openTime'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.commission_date'],
    value: 'closeTime'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.lots_date'],
    value: 'rebateTime'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.stardard'],
    value: 'rebateStandard'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.formula'],
    value: 'formula'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.status'],
    value: 'rebateStatus'
  }
];

// 佣金报表 按天返佣到账状态
export const REALTIME_FLAG = [
  {
    label: i18n['report.real_Time_Commisson_Header.action_all'],
    value: 'all'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.action_success'],
    value: 'done'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.action_failed'],
    value: 'failed'
  }
];

// 佣金报表 实时返佣到账状态
export const RTCOMMISSION_FLAG = [
  {
    label: i18n['report.real_Time_Commisson_Header.action_all'],
    value: 'all'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.action_success'],
    value: 'done'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.action_failed'],
    value: 'failed'
  },
  {
    label: i18n['report.real_Time_Commisson_Header.action_processing'],
    value: 'processing'
  }
];

export const TYPE_TRANSFER = {
  0: i18n['report.real_Time_Header.rebate_type_0'],
  1: i18n['report.real_Time_Header.rebate_type_1'],
  3: i18n['report.real_Time_Header.rebate_type_3'],
  2: i18n['report.real_Time_Header.rebate_type_2'],
  5: i18n['report.real_Time_Header.rebate_type_5'],
  4: i18n['report.real_Time_Header.rebate_type_4']
};

export const EXPORT_TYPE = [
  {
    label: i18n['report.download_tips_modal.detail'],
    value: false
  },
  {
    label: i18n['report.download_tips_modal.summary'],
    value: true
  }
];

export const EXPORT_COMMON_TYPE = [
  {
    label: i18n['report.download_tips_modal.summary_user'],
    value: false
  },
  {
    label: i18n['report.download_tips_modal.current_user'],
    value: true
  }
];

export const COMMISSION_TYPE_FLAG = [
  {
    label: i18n['report.real_Time_Header.rebate_type_0'],
    value: '0'
  },
  {
    label: i18n['report.real_Time_Header.rebate_type_5'],
    value: '5'
  }
];

// 交易返佣查询 数据范围option
export const LOTSNEWSEARCH_FLAG = [
  {
    label: i18n['report.lotsNewSearch_condition.data_range.directly'],
    value: 'sub'
  },
  {
    label: i18n['report.lotsNewSearch_condition.data_range.sub'],
    value: 'subBelong'
  }
];

// 佣金报表 实时返佣报表筛选条件
export const RTCOMMISSION_ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['report.download_tips_modal.download_object'],
    value: 'objectType',
    fieldType: 'userLevel',
    conditions: ['EQ'],
    default: true,
    mainFilter: true,
    unique: true
  },
  {
    label: i18n['report.download_tips_modal.download_object'],
    value: 'objectType',
    fieldType: 'simpleSelect',
    conditions: ['EQ'],
    default: true,
    mainFilter: true,
    addToTop: true
  },
  {
    label: i18n['report.download_tips_modal.close_time_range'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['between'],
    rangeConditions: true,
    key: 'filterDate',
    keepOpen: true,
    index: 3,
    additions: {
      ranges: defaultRanges,
      dateLimit: { months: 6 },
      showTime: {
        format: 'HH:mm'
      },
      format: 'YYYY-MM-DD H:mm'
    }
  },
  // {
  //   label: i18n['report.download_tips_modal.download_object'],
  //   value: 'userId',
  //   fieldType: 'user',
  //   conditions: ['equals'],
  //   default: true
  // },
  {
    label: i18n['report.real_Time_Header.status'],
    value: 'status',
    fieldType: 'select',
    conditions: ['EQ'],
    key: 'status'
  },
  {
    label: i18n['report.real_Time_Header.rebate_type'],
    value: 'rebateType',
    fieldType: 'select',
    conditions: ['EQ'],
    key: 'rebateType'
  }
];

export const ADVANCED_SEARCH_CONFIG = {
  arraySplit: '@#$', //数组分隔符
  fieldKey: 'key',
  conditionKey: 'type',
  dateFormat: 'YYYY-MM-DD', // 时间分隔符
  rangeSplit: '~'
};

// 新版报表
export const NEW_REPORTTYPE_FILTER = {
  LotsNewSearch: 'TRADING_REBATE_SEARCH',
  RTCommission: 'RCR_REPORT',
  LotsNew: 'TRADING_REBATE_REPORT'
};

const TableType = {
  LOTSNEW_HEADER,
  LOTSNEW_ADVANCED_SEARCH_TYPE,
  DEPOSIT_HEADER,
  NETDEPOSIT_HEADER,
  PROFIT_HEADER,
  NETPROFIT_HEADER,
  COMMISSIONCHARGE_HEADER,
  REALTIME_HEADER,
  REALTIME_ADVANCED_SEARCH_TYPE,
  RTCOMMISSION_HEADER,
  RTCOMMISSION_ADVANCED_SEARCH_TYPE,
  REALTIME_FLAG,
  RTCOMMISSION_FLAG,
  COMMON_ADVANCED_SEARCH_TYPE,
  LOTSNEWSEARCH_HEADER,
  LOTSNEWSEARCH_ADVANCED_SEARCH_TYPE,
  LOTSNEWSEARCH_FLAG
};
export default TableType;
