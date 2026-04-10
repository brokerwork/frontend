import i18n from 'utils/i18n';

//筛选条件
export const PRIVILEGE_TYPE = [
  {
    label: i18n['report.privilege_type.sub'],
    value: 'sub',
    right: 'STAT_VIEW_ACC_RANGE_MY'
  },
  {
    label: i18n['report.privilege_type.sub_belong'],
    value: 'subBelong',
    right: 'STAT_VIEW_ACC_RANGE_SUB'
  },
  {
    label: i18n['report.privilege_type.no_parent'],
    value: 'noParent',
    right: 'STAT_VIEW_ACC_RANGE_NO'
  },
  {
    label: i18n['report.privilege_type.all'],
    value: 'all',
    right: 'STAT_VIEW_ACC_RANGE_ALL'
  }
];

// 报表高级筛选条件
export const ADVANCED_SEARCH_CONDITIONS = [
  {
    label: i18n['report.advanced_search_conditions.in'],
    value: 'in'
  },
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

//账户报表类型下拉框
export const STATISTICAL_REPORT_TYPE = [
  {
    label: i18n['report.account_table_type.accounts_summary'],
    value: 'AccountSummary',
    right: 'STAT_VIEW_ACC_REPORTTYPE_ZACC'
  },
  {
    label: i18n['report.account_table_type.account_dw'],
    value: 'AccountDw',
    right: 'STAT_VIEW_ACC_REPORTTYPE_FUND'
  },
  {
    label: i18n['report.account_table_type.position'],
    value: 'Position',
    right: 'STAT_VIEW_ACC_REPORTTYPE_POSITION'
  },
  {
    label: i18n['report.account_table_type.order'],
    value: 'Order',
    right: 'STAT_VIEW_ACC_REPORTTYPE_GUADAN'
  },
  {
    label: i18n['report.account_table_type.history_order'],
    value: 'HistoryOrder',
    right: 'STAT_VIEW_ACC_REPORTTYPE_HISTORY'
  },
  {
    label: i18n['report.account_table_type.variety_group'],
    value: 'SymbolGroup',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_VCR'
  },
  {
    label: i18n['report.account_table_type.stop_loss'],
    value: 'StopLimit',
    right: 'STAT_VIEW_ACC_REPORTTYPE_SLCS'
  },
  {
    label: i18n['report.account_table_type.new_account'],
    value: 'NewUser',
    right: 'STAT_VIEW_ACC_REPORTTYPE_NAR'
  }
];

//默认搜索字段
export const DEFAULT_SEARCH_TYPE = [
  {
    label: i18n['report.search_type.account_name'],
    value: 'AccountName'
  },
  {
    label: i18n['report.search_type.account_no'],
    value: 'AccountNo'
  },
  {
    label: i18n['report.search_type.order_no'],
    value: 'OrderNo'
  }
];

//品种组报表等专用搜索字段
export const SYMBOL_SEARCH_TYPE = [
  {
    label: i18n['report.search_type.account_no'],
    value: 'AccountNo'
  }
];

//综合报表专属搜索字段
export const SPECIAL_SEARCH_TYPE = [
  {
    label: i18n['report.search_type.account_name'],
    value: 'AccountName'
  },
  {
    label: i18n['report.search_type.account_no'],
    value: 'AccountNo'
  }
];

export const DATE_RANGE_TYPE = [
  {
    label: i18n['report.account_table_type.accounts_summary'],
    value: 'AccountSummary'
  },
  {
    label: i18n['report.account_table_type.account_dw'],
    value: 'AccountDw'
  },
  {
    label: i18n['report.account_table_type.position'],
    value: 'Position'
  },
  {
    label: i18n['report.account_table_type.order'],
    value: 'Order'
  },
  {
    label: i18n['report.account_table_type.history_order'],
    value: 'HistoryOrder'
  }
];
// 佣金报表 实时返佣到账状态
export const REAL_TIME_COMMISSION_FLAG = [
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

//佣金报表 搜索字段
export const COMMISSION_SEARCH_TYPE = [
  {
    label: i18n['report.commission_search_type.account_name'],
    value: 'AccountName'
  },
  {
    label: i18n['report.commission_search_type.account_no'],
    value: 'AccountNo'
  }
];

//佣金报表 搜索字段
export const SPECIAL_COMMISSION_SEARCH_TYPE = [
  {
    label: i18n['report.commission_search_type.account_no'],
    value: 'AccountNo'
  }
];

//佣金报表 报表类型筛选
export const COMMISSION_REPORT_TYPE = [
  {
    label: i18n['report.commission_table_type.Lots'],
    value: 'LotsNew',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_TRADE'
  },
  {
    label: i18n['report.commission_table_type.LotsNewSearch'],
    value: 'LotsNewSearch',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_TRADE'
  },
  {
    label: i18n['report.commission_table_type.Deposit'],
    value: 'Deposit',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_DEPOSIT'
  },
  {
    label: i18n['report.commission_table_type.NetDeposit'],
    value: 'NetDeposit',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_NETDEPOSIT'
  },
  {
    label: i18n['report.commission_table_type.Profit'],
    value: 'Profit',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_PROFIT'
  },
  {
    label: i18n['report.commission_table_type.NetProfit'],
    value: 'NetProfit',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_NETPROFIT'
  },
  {
    label: i18n['report.commission_table_type.CommissionCharge'],
    value: 'CommissionCharge',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_COMMISSION'
  },
  {
    label: i18n['report.commission_table_type.RealTime'],
    value: 'RealTime',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_AUTO'
  },
  {
    label: i18n['report.commission_table_type.RTCommission'],
    value: 'RTCommission',
    right: 'STAT_VIEW_COMMISSION_REPORTTYPE_RCR'
  }
];

//佣金报表 交易返佣报表明细
export const LOTS_DETAIL = [
  {
    label: '',
    value: 'fold'
  },
  {
    label: i18n['report.lots_Detail.name'],
    value: 'name'
  },
  {
    label: i18n['report.download_tips_modal.symbol_type'],
    value: 'symbol_group'
  },
  {
    label: i18n['report.lots_Detail.close_volume'],
    value: 'close_volume'
  },
  {
    label: i18n['report.lots_Detail.detail_value'],
    value: 'detail_value'
  },
  {
    label: i18n['report.lots_Detail.balance_type'],
    value: 'balance_type'
  },
  {
    label: i18n['report.lots_Detail.money'],
    value: 'money'
  }
];

//佣金报表 手续费返佣报表明细
export const COMMISSION_CHARGE_DETAIL = [
  {
    label: '',
    value: 'fold'
  },
  {
    label: i18n['report.lots_Detail.name'],
    value: 'name'
  },
  {
    label: i18n['report.download_tips_modal.symbol_type'],
    value: 'symbol_group'
  },
  {
    label: i18n['report.lots_Detail.close_volume'],
    value: 'close_volume'
  },
  {
    label: i18n['report.lots_Detail.detail_value'],
    value: 'detail_value'
  },
  {
    label: i18n['report.lots_Detail.balance_type'],
    value: 'balance_type'
  },
  {
    label: i18n['report.lots_Detail.money'],
    value: 'money'
  }
];

// 佣金报表 交易返佣报表的表中表明细
export const LOTS_DETAIL_TABLE = [
  {
    label: i18n['report.lots_Detail_modal.login'],
    value: 'login'
  },
  {
    label: i18n['report.lots_Detail_modal.ticket'],
    value: 'ticket'
  },
  {
    label: i18n['report.stop_loss_Header.open_time'],
    value: 'open_date'
  },
  {
    label: i18n['report.history_order_Header.close_time'],
    value: 'close_date'
  },
  {
    label: i18n['report.lots_Detail.close_volume'],
    value: 'close_volume'
  },
  // 交易品种
  {
    label: i18n['report.lots_Detail_modal.symbol'],
    value: 'symbol'
  },
  // 价格
  {
    label: i18n['report.lots_Detail_modal.close_price'],
    value: 'close_price'
  },
  // 手续费
  {
    label: i18n['report.lots_Detail_modal.commission_label'],
    value: 'commission'
  },
  // 隔夜利息
  {
    label: i18n['report.lots_Detail_modal.storage'],
    value: 'storage'
  },
  // 盈亏
  {
    label: i18n['report.lots_Detail_modal.profit'],
    value: 'profit'
  },
  {
    label: i18n['report.lots_Detail_modal.money'],
    value: 'money'
  }
];

//佣金报表 实时返佣报表明细
export const REAL_TIME_DETAIL = [
  {
    label: i18n['report.real_time_Detail.login'],
    value: 'login'
  },
  {
    label: i18n['report.real_time_Detail.name'],
    value: 'name'
  },
  {
    label: i18n['report.real_time_Detail.parent_name'],
    value: 'parent_name'
  },
  {
    label: i18n['report.real_time_Detail.rule_name'],
    value: 'rule_name'
  },
  {
    label: i18n['report.real_time_Detail.commission_value'],
    value: 'commission_value'
  }
];

//多人情况下佣金报表下载可选字段
//交易返佣报表可选字段
export const DOWNLOAD_LOTS_HEADER = [
  {
    label: i18n['report.lots_Header.row_heji_volume'],
    value: 'row_heji_volume'
  },
  {
    label: i18n['report.lots_Header.row_heji_open_close_volume'],
    value: 'row_heji_open_close_volume'
  },
  {
    label: i18n['report.download_tips_modal.commission_total'],
    value: 'total_row_heji_money'
  }
];

//入金返佣报表可选字段
export const DOWNLOAD_DEPOSIT_HEADER = [
  {
    label: i18n['report.deposit_Header.lots_money'],
    value: 'lots_money'
  },
  {
    label: i18n['report.download_tips_modal.commission_total'],
    value: 'total_row_heji'
  }
];

//净入金返佣报表可选字段
export const DOWNLOAD_NET_DEPOSIT_HEADER = [
  {
    label: i18n['report.net_deposit_Header.lots_money'],
    value: 'lots_money'
  },
  {
    label: i18n['report.download_tips_modal.commission_total'],
    value: 'total_row_heji'
  }
];

//手续费分成返佣报表可选字段
export const DOWNLOAD_COMMISSION_CHARGE_HEADER = [
  {
    label: i18n['report.commission_charge_Header.total_charge'],
    value: 'row_heji_commission'
  },
  {
    label: i18n['report.commission_charge_Header.commission'],
    value: 'total_row_heji_money'
  }
];

//盈利分成返佣报表可选字段
export const DOWNLOAD_PROFIT_HEADER = [
  {
    label: i18n['report.profit_Header.lots_money'],
    value: 'lots_money'
  },
  {
    label: i18n['report.download_tips_modal.commission_total'],
    value: 'total_row_heji'
  }
];

//按天返佣报表可选字段
export const DOWNLOAD_REAL_TIME_HEADER = [
  {
    label: i18n['report.real_Time_Header.level_name'],
    value: 'level_name'
  },
  {
    label: i18n['report.real_Time_Header.login'],
    value: 'login'
  },
  {
    label: i18n['report.real_Time_Header.total_commission_value'],
    value: 'total_commission_value'
  },
  {
    label: i18n['report.real_Time_Header.status_success'],
    value: 'status_success'
  },
  {
    label: i18n['report.real_Time_Header.status_failed'],
    value: 'status_failed'
  }
];

//实时返佣报表可选字段
export const DOWNLOAD_REAL_TIME_COMMISSION_HEADER = [
  {
    label: i18n['report.real_Time_Commission_Header.level_name'],
    value: 'level_name'
  },
  {
    label: i18n['report.real_Time_Commission_Header.total_volume'],
    value: 'total_volume'
  },
  {
    label: i18n['report.real_Time_Header.rebate_type'],
    value: 'rebate_type'
  },
  {
    label: i18n['report.real_Time_Commission_Header.status_success'],
    value: 'status_success'
  },
  {
    label: i18n['report.real_Time_Commission_Header.status_failed'],
    value: 'status_failed'
  }
];

export const TYPE_TRANSFER = {
  0: i18n['report.real_Time_Header.rebate_type_0'],
  1: i18n['report.real_Time_Header.rebate_type_1'],
  5: i18n['report.real_Time_Header.rebate_type_5'],
  4: i18n['report.real_Time_Header.rebate_type_4']
};

// 报表高级筛选条件
export const REPORT_ADVANCED_SEARCH_CONDITIONS = [
  {
    label: i18n['report.advanced_search_conditions.equals'],
    value: 'equals'
  },
  {
    label: i18n['report.advanced_search_conditions.not_equals'],
    value: 'not_equals'
  },
  {
    label: i18n['report.advanced_search_conditions.big'],
    value: 'big'
  },
  {
    label: i18n['report.advanced_search_conditions.less'],
    value: 'less'
  },
  {
    label: i18n['report.advanced_search_conditions.like'],
    value: 'like'
  },
  {
    label: i18n['report.advanced_search_conditions.not_like'],
    value: 'not_like'
  },
  {
    label: i18n['report.advanced_search_conditions.between'],
    value: 'between'
  }
];

// 报表高级搜索额外字段
export const REPORT_ADVANCED_SEARCH_CONDITIONS_EXTRA_FIELD = [
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
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'user_id',
    fieldType: 'user',
    conditions: ['equals'],
    default: true
  }
];

export const REPORT_ADVANCED_SEARCH_CMD_OPTION = [
  {
    label: i18n['report.advanced_search_conditions.buy'],
    value: 'buy'
  },
  {
    label: i18n['report.advanced_search_conditions.sell'],
    value: 'sell'
  }
];

//业绩报表类型
export const OUTSTANDING_REPORT_TYPE = [
  {
    label: i18n['navigation.report.outstandingreport_managment'],
    value: 'UserEarning',
    right: 'STAT_VIEW_ACHIEVEMENT_TYPE_PF'
  }
];

//业绩报表表头
export const OUTSTANDING_RRPORT_HEADERS = [
  {
    label: i18n['report.user_earning_Header.name'],
    value: 'name'
  },
  {
    label: i18n['report.user_earning_Header.level_name'],
    value: 'level_name'
  },
  {
    label: i18n['report.user_earning_Header.customer_count'],
    value: 'customer_count'
  },
  {
    label: i18n['report.user_earning_Header.account_count'],
    value: 'account_count'
  },
  {
    label: i18n['report.user_earning_Header.d'],
    value: 'd'
  },
  {
    label: i18n['report.user_earning_Header.w'],
    value: 'w'
  },
  {
    label: i18n['report.user_earning_Header.volume'],
    value: 'volume'
  },
  {
    label: i18n['report.user_earning_Header.direct_sub_count'],
    value: 'direct_sub_count'
  },
  {
    label: i18n['report.user_earning_Header.indirect_sub_count'],
    value: 'indirect_sub_count'
  }
];

export const OUTSTANDING_PRIVILEGE_TYPE = [
  {
    label: i18n['usermgmt.user_search_type.all'],
    value: 'all',
    right: 'STAT_VIEW_ACHIEVEMENT_RANGE_ALL'
  },
  {
    label: i18n['usermgmt.user_search_type.sub'],
    value: 'sub',
    right: 'STAT_VIEW_ACHIEVEMENT_RANGE_DIRECTLY'
  },
  {
    label: i18n['usermgmt.user_search_type.sub_be_long'],
    value: 'subBelong',
    right: 'STAT_VIEW_ACHIEVEMENT_RANGE_SUB'
  },
  {
    label: i18n['usermgmt.user_search_type.no_parent'],
    value: 'noParent',
    right: 'STAT_VIEW_ACHIEVEMENT_RANGE_SUPERIOR'
  }
];
export const CTRADER_NOSHOW_TYPE = ['change'];
export const CTRADER_COLUMNS_FILTER = {
  POSITION: ['commission', 'storage', 'profit'],
  STOPLIMIT: ['storage', 'profit'],
  HISTORYORDER: ['open_price', 'open_time', 'open_close']

  // ORDER: ['volume']
}; // 手续费

export const NOTICE_KEY = 'REPORT_NOTICE_KEY';
export const NOTICE_VERSION = '1.0';
//返佣失败报表的部分增加的搜索类型
export const FAILD_COMMISSION_SEARCH_TYPE = [
  {
    label: i18n['report.retry_deposit.search_account_no'],
    value: 'AccountNo',
    daycommission: true
  },
  {
    label: i18n['report.retry_deposit.search_order_no'],
    value: 'OrderNo'
  }
];
export const ADVANCED_SEARCH_CONFIG = {
  searchType: 'BW_REPORT',
  fieldKey: 'key',
  conditionKey: 'type',
  dateFormat: 'YYYY-MM-DD', // 时间分隔符
  rangeSplit: '-'
};

//业绩报表表头
export const AGENT_DEPOSIT_RRPORT_HEADERS = [
  {
    label: i18n['report.agent_deposit_header.name'],
    value: 'name'
  },
  {
    label: i18n['report.agent_deposit_header.login'],
    value: 'login'
  },
  {
    label: i18n['report.agent_deposit_header.balance'],
    value: 'balance'
  },
  {
    label: i18n['report.agent_deposit_header.marginWarn'],
    value: 'marginWarn'
  },
  {
    label: i18n['report.agent_deposit_header.accountNum'],
    value: 'accountNum'
  },
  {
    label: i18n['report.agent_deposit_header.account_total_balance'],
    value: 'accountTotalBalance'
  },
  {
    label: i18n['report.agent_deposit_header.positionNum'],
    value: 'positionNum'
  },
  {
    label: i18n['report.agent_deposit_header.action'],
    value: 'action'
  }
];

//综合报表专属搜索字段
export const AGENT_SEARCH_TYPE = [
  {
    label: i18n['report.agent_deposit_header.name'],
    value: 'name'
  },
  {
    label: i18n['report.agent_deposit_header.login'],
    value: 'login'
  }
];
// mt5开平仓搜索字段
export const OPEN_CLOSE_SEARCH_TYPE = [
  {
    label: i18n['report.history_order_Header.open'],
    value: 'open'
  },
  {
    label: i18n['report.history_order_Header.close'],
    value: 'close'
  }
];
