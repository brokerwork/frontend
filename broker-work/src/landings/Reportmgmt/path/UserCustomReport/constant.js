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

export const OUTSTANDING_PRIVILEGE_TYPE = [
  {
    label: i18n['usermgmt.user_search_type.all'],
    value: 'allSee',
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

export const ADVANCED_SEARCH_TYPE = {
  /**
   * 用户报表
   */
  USER: [
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
      label: i18n['report.user_earning_download.user_level'],
      value: 'levelName',
      fieldType: 'select',
      conditions: ['EQ'],
      key: 'levelName'
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
