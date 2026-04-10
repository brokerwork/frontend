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

export const ADVANCED_SEARCH_CONFIG = {
  arraySplit: '@#$', //数组分隔符
  fieldKey: 'key',
  conditionKey: 'type',
  dateFormat: 'YYYY-MM-DD', // 时间分隔符
  rangeSplit: '~'
};

export const ADVANCED_SEARCH_CONDITIONS = [
  { label: i18n['report.advanced_search_conditions.equals'], value: 'EQ' },
  {
    label: i18n['report.advanced_search_conditions.not_equals'],
    value: 'NEQ'
  },
  { label: i18n['report.advanced_search_conditions.big'], value: 'GT' },
  { label: i18n['report.advanced_search_conditions.less'], value: 'LT' },
  { label: i18n['report.advanced_search_conditions.like'], value: 'REGEX' },
  {
    label: i18n['report.advanced_search_conditions.between'],
    value: 'BETWEEN'
  },
  { label: i18n['customer.advanced_search.conditions.eq'], value: 'IN' },
  { label: i18n['customer.advanced_search.conditions.neq'], value: 'NIN' }
];

export const ADVANCED_SEARCH_TYPE = {
  ORDER: [
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'userLevel',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true
    },
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'simpleSelect',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true,
      addToTop: true
    },
    {
      label: i18n['report.download_tips_modal.time_range'],
      value: 'openTime',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      key: 'openTime',
      keepOpen: true,
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.ticket'],
      value: 'ticket',
      fieldType: 'input',
      conditions: ['EQ', 'REGEX']
    },
    {
      label: i18n['report.custom_report.advance_search.login'],
      value: 'login',
      fieldType: 'input',
      conditions: ['EQ']
    },

    {
      label: i18n['report.custom_report.advance_search.name'],
      value: 'name',
      fieldType: 'input',
      conditions: ['REGEX']
    },
    {
      label: i18n['report.custom_report.advance_search.group'],
      value: 'group',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.accountGroup'],
      value: 'accountGroup',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.cmd'],
      value: 'cmd',
      fieldType: 'select',
      conditions: ['EQ'],
      optionList: [
        {
          label: 'buy',
          value: 'buy'
        },
        {
          label: 'sell',
          value: 'sell'
        }
      ]
    },
    {
      label: i18n['report.custom_report.advance_search.symbol'],
      value: 'symbol',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.volume'],
      value: 'volume',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.order_openPrice'],
      value: 'openPrice',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.sl'],
      value: 'sl',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.tp'],
      value: 'tp',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    }
  ],
  /**
   * 账户报表
   */
  ACCOUNT: [
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'userLevel',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true
    },
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'simpleSelect',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true,
      addToTop: true
    },
    {
      label: i18n['report.download_tips_modal.time_range'],
      value: 'openTime',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      key: 'openTime',
      keepOpen: true,
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.ticket'],
      value: 'ticket',
      fieldType: 'input',
      conditions: ['EQ', 'REGEX']
    },
    {
      label: i18n['report.custom_report.advance_search.name'],
      value: 'name',
      fieldType: 'input',
      conditions: ['EQ']
    },
    {
      label: i18n['report.custom_report.advance_search.login'],
      value: 'login',
      fieldType: 'input',
      conditions: ['EQ']
    },
    {
      label: i18n['report.custom_report.advance_search.group'],
      value: 'group',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.accountGroup'],
      value: 'accountGroup',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    // leverage 的 optionlist 还没有
    {
      label: i18n['report.custom_report.advance_search.leverage'],
      value: 'leverage',
      fieldType: 'select',
      conditions: ['IN', 'NIN'],
      key: 'leverage',
      additions: { checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.createTime'],
      value: 'createTime',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      key: 'createTime',
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.firstDepositTime'],
      value: 'firstDepositTime',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      key: 'firstDepositTime',
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.balance'],
      value: 'balance',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },

    {
      label: i18n['report.custom_report.advance_search.equity'],
      value: 'equity',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.credit'],
      value: 'credit',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.deposit'],
      value: 'deposit',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.withdraw'],
      value: 'withdraw',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.netDeposit'],
      value: 'netDeposit',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.closeVolume'],
      value: 'closeVolume',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    }
  ],
  /**
   * 用户报表
   */
  USER: [
    {
      label: i18n['customer.advanced_search.field.filterType'],
      value: 'filterType',
      fieldType: 'select',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true
    },
    {
      label: i18n['report.download_tips_modal.time_range'],
      value: 'openTime',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      key: 'openTime',
      keepOpen: true,
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.login'],
      value: 'login',
      fieldType: 'input',
      conditions: ['EQ']
    }
  ],
  /**
   * 资金变动报表
   */
  FUND_CHANGE: [
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'userLevel',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true
    },
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'simpleSelect',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true,
      addToTop: true
    },
    {
      label: i18n['report.download_tips_modal.fund_time'],
      value: 'openTime',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      key: 'openTime',
      keepOpen: true,
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.accountGroup'],
      value: 'accountGroup',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.cmdStr'],
      value: 'cmd',
      fieldType: 'select',
      conditions: ['IN'],
      optionList: [
        {
          label: i18n['report.custom_report.cmdStr.balance'],
          value: 'balance'
        },
        {
          label: i18n['report.custom_report.cmdStr.credit'],
          value: 'credit'
        }
      ]
    },
    {
      label: i18n['report.custom_report.advance_search.comment'],
      value: 'comment',
      fieldType: 'input',
      conditions: ['REGEX']
    },
    {
      label: i18n['report.custom_report.advance_search.group'],
      value: 'group',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.login'],
      value: 'login',
      fieldType: 'input',
      conditions: ['EQ']
    },
    {
      label: i18n['report.custom_report.advance_search.name'],
      value: 'name',
      fieldType: 'input',
      conditions: ['EQ']
    },
    {
      label: i18n['report.custom_report.advance_search.profit'],
      value: 'profit',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.ticket'],
      value: 'ticket',
      fieldType: 'input',
      conditions: ['EQ', 'REGEX']
    }
  ],
  /**
   * MT4交易订单报表
   */
  MT4_TRADE_ORDER: [
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'userLevel',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true
    },
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'simpleSelect',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true,
      addToTop: true
    },
    {
      label: i18n['report.download_tips_modal.time_range'],
      value: 'openTime',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      key: 'openTime',
      keepOpen: true,
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.ticket'],
      value: 'ticket',
      fieldType: 'input',
      conditions: ['EQ', 'REGEX']
    },
    {
      label: i18n['report.custom_report.advance_search.login'],
      value: 'login',
      fieldType: 'input',
      conditions: ['EQ']
    },
    {
      label: i18n['report.custom_report.advance_search.group'],
      value: 'group',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.accountGroup'],
      value: 'accountGroup',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.cmd'],
      value: 'cmd',
      fieldType: 'select',
      conditions: ['EQ'],
      optionList: [
        {
          label: 'buy',
          value: 'buy'
        },
        {
          label: 'sell',
          value: 'sell'
        }
      ]
    },
    {
      label: i18n['report.custom_report.advance_search.volume'],
      value: 'volume',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.openPrice'],
      value: 'openPrice',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.openTime'],
      value: 'time',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.closePrice'],
      value: 'closePrice',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.closeTime'],
      value: 'closeTime',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.commission'],
      value: 'commission',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.swap'],
      value: 'swap',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.profit'],
      value: 'profit',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    }
  ],
  /**
   * MT5交易订单报表
   */
  MT5_TRADE_ORDER: [
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'userLevel',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true
    },
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'simpleSelect',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true,
      addToTop: true
    },
    {
      label: i18n['report.download_tips_modal.time_range'],
      value: 'openTime',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      key: 'openTime',
      keepOpen: true,
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.ticket'],
      value: 'ticket',
      fieldType: 'input',
      conditions: ['EQ', 'REGEX']
    },
    {
      label: i18n['report.custom_report.advance_search.login'],
      value: 'login',
      fieldType: 'input',
      conditions: ['EQ']
    },
    {
      label: i18n['report.custom_report.advance_search.name'],
      value: 'name',
      fieldType: 'input',
      conditions: ['EQ']
    },
    {
      label: i18n['report.custom_report.advance_search.group'],
      value: 'group',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.accountGroup'],
      value: 'accountGroup',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.cmd'],
      value: 'cmd',
      fieldType: 'select',
      conditions: ['EQ'],
      optionList: [
        {
          label: 'buy',
          value: 'buy'
        },
        {
          label: 'sell',
          value: 'sell'
        }
      ]
    },
    {
      label: i18n['report.custom_report.advance_search.symbol'],
      value: 'symbol',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.volume'],
      value: 'volume',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.openPrice'],
      value: 'openPrice',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.commission'],
      value: 'commission',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.swap'],
      value: 'swap',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.profit'],
      value: 'profit',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    }
  ],
  /**
   * 持仓单报表
   */
  POSITION_ORDER: [
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'userLevel',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true
    },
    {
      label: i18n['report.download_tips_modal.belong'],
      value: 'objectType',
      fieldType: 'simpleSelect',
      conditions: ['EQ'],
      default: true,
      mainFilter: true,
      unique: true,
      addToTop: true
    },
    {
      label: i18n['report.download_tips_modal.time_range'],
      value: 'openTime',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      key: 'openTime',
      keepOpen: true,
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.ticket'],
      value: 'ticket',
      fieldType: 'input',
      conditions: ['EQ', 'REGEX']
    },
    {
      label: i18n['report.custom_report.advance_search.login'],
      value: 'login',
      fieldType: 'input',
      conditions: ['EQ']
    },

    {
      label: i18n['report.custom_report.advance_search.name'],
      value: 'name',
      fieldType: 'input',
      conditions: ['REGEX']
    },
    {
      label: i18n['report.custom_report.advance_search.group'],
      value: 'group',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.accountGroup'],
      value: 'accountGroup',
      fieldType: 'select',
      conditions: ['IN'],
      additions: { searchable: true, checkbox: true, selectAllButton: true }
    },
    {
      label: i18n['report.custom_report.advance_search.cmd'],
      value: 'cmd',
      fieldType: 'select',
      conditions: ['EQ'],
      optionList: [
        {
          label: 'buy',
          value: 'buy'
        },
        {
          label: 'sell',
          value: 'sell'
        }
      ]
    },
    {
      label: i18n['report.custom_report.advance_search.volume'],
      value: 'volume',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.openPrice'],
      value: 'openPrice',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.openTime'],
      value: 'time',
      fieldType: 'date',
      conditions: ['BETWEEN'],
      rangeConditions: true,
      index: 3,
      additions: { ranges: defaultRanges, dateLimit: { months: 6 } }
    },
    {
      label: i18n['report.custom_report.advance_search.sl'],
      value: 'sl',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.tp'],
      value: 'tp',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.swap'],
      value: 'swap',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    },
    {
      label: i18n['report.custom_report.advance_search.profit'],
      value: 'profit',
      fieldType: 'input',
      conditions: ['EQ', 'NEQ', 'GT', 'LT']
    }
  ]
};

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
