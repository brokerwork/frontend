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
// 业绩报表统计范围
export const OUTSTANDING_STATISTICAL_RANGE = [
  {
    label: i18n['report.outstanding_report.range_straight'],
    value: 'straight'
  },
  {
    label: i18n['report.outstanding_report.range_straight_other'],
    value: 'other'
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

export const OUTSTANDING_ADVANCED_SEARCH_TYPE = [
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
    label: i18n['report.user_earning_download.user_range'],
    value: 'isSubBelong',
    fieldType: 'select',
    conditions: ['equals'],
    key: 'isSubBelong',
    keepOpen: true
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userId',
    fieldType: 'user',
    conditions: ['equals'],
    default: true
  },
  {
    label: i18n['report.user_earning_download.user_level'],
    value: 'levelId',
    fieldType: 'select',
    conditions: ['equals'],
    key: 'levelId'
  }
];

export const ADVANCED_SEARCH_CONFIG = {
  arraySplit: '@#$', //数组分隔符
  fieldKey: 'key',
  conditionKey: 'type',
  dateFormat: 'YYYY-MM-DD', // 时间分隔符
  rangeSplit: '~'
};
