import i18n from 'utils/i18n';
// 高级搜索条件
export const ADVANCED_SEARCH_CONDITIONS = [
  {
    label: '=',
    value: 'EQ'
  },
  { label: i18n['customer.advanced_search.conditions.eq'], value: 'IN' },
  { label: '≠', value: 'NEQ' },
  { label: i18n['customer.advanced_search.conditions.neq'], value: 'NIN' },
  { label: i18n['customer.advanced_search.conditions.regex'], value: 'REGEX' },
  { label: '>', value: 'GT' },
  { label: '<', value: 'LT' },
  {
    label: '<>',
    value: 'BETWEEN'
  }
];

//列表字段
export const TW_USER_TABLE_FIELD = [
  { label: 'ID', key: 'userNo' },
  { label: i18n['tausermgmt.table_header.registered_name'], key: 'realName' },
  { label: i18n['tausermgmt.table_header.wxname'], key: 'wxname' },
  { label: i18n['tausermgmt.table_header.email'], key: 'email' },
  { label: i18n['tausermgmt.table_header.phone'], key: 'phone' },
  { label: i18n['tausermgmt.table_header.username'], key: 'username' },
  { label: i18n['tausermgmt.table_header.account'], key: 'accounts' },
  {
    label: i18n['tausermgmt.table_header.registration_time'],
    key: 'registerTime'
  },
  {
    label: i18n['tausermgmt.table_header.recent_login_time'],
    key: 'lastLoginTime'
  },
  { label: i18n['tausermgmt.table_header.login_status'], key: 'login_status' }
];

// 高级搜索
export const ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['tausermgmt.table_header.registration_time'],
    value: 'registerTime',
    fieldType: 'date',
    conditions: ['BETWEEN'],
    rangeConditions: true,
    default: true,
    keepOpen: true
  },
  {
    label: i18n['tausermgmt.table_header.username'],
    value: 'userName',
    fieldType: 'input',
    conditions: ['EQ']
  },
  {
    label: i18n['tausermgmt.table_header.phone'],
    value: 'phone',
    fieldType: 'input',
    conditions: ['EQ']
  }
];

export const TW_USER_DETAIL = [
  {
    label: i18n['tausermgmt.detail.username'],
    value: 'userName'
  },
  {
    label: i18n['tausermgmt.detail.email'],
    value: 'email'
  },
  {
    label: i18n['tausermgmt.detail.mobile_phone'],
    value: 'mobilePhone'
  }
];

export const TW_USER_ACCOUNT_DETAIL = [
  {
    label: i18n['tausermgmt.detail.account.platform'],
    value: 'platform'
  },
  {
    label: i18n['tausermgmt.detail.account.server'],
    value: 'serverName'
  },
  {
    label: i18n['tausermgmt.detail.account.account_type'],
    value: 'accountType'
  },
  {
    label: i18n['tausermgmt.detail.account.pay_account'],
    value: 'account'
  },
  {
    label: i18n['tausermgmt.detail.account.account_name'],
    value: 'accountName'
  },
  {
    label: i18n['tausermgmt.detail.account.bind_time'],
    value: 'bindTime'
  },
  {
    label: i18n['tausermgmt.detail.account.state'],
    value: 'state'
  }
];
