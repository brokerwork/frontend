import i18n from 'utils/i18n';
// 报表高级筛选条件
export const ADVANCED_SEARCH_CONDITIONS = [
  { label: '=', value: 'equals' },
  {
    label: '≠',
    value: 'not_equals'
  },
  { label: '>', value: 'big' },
  { label: '<', value: 'less' },
  { label: i18n['report.advanced_search_conditions.like'], value: 'like' },
  {
    label: i18n['report.advanced_search_conditions.not_like'],
    value: 'not_like'
  }
];
export const WITH_ORIGIN = [
  'oweId',
  'participant',
  'leverage',
  'userGroup',
  'group',
  'customerName',
  'city',
  'userId',
  'userSearchType',
  'objectType',
  'symbol',
  'account_group',
  'commendName'
];
