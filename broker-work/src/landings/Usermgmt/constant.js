import i18n from 'utils/i18n';
export const DISABLED_FIELD_NORMAL = [
  'idType',
  'idNum',
  'idUrl1',
  'idUrl2',
  'bankAccount',
  'accountNo',
  'bankCardFile1',
  'bankCardFile2',
  'doAgencyBusiness',
  'investExperience',
  'field01',
  'field02',
  'field03',
  'field04',
  'field05',
  'field06',
  'field07',
  'field08',
  'field09',
  'field10',
  'field11',
  'field12',
  'field13',
  'field14',
  'field15',
  'field16',
  'field17',
  'field18',
  'field19',
  'field20'
];
export const ADVANCED_SEARCH_TIME_TYPE = ['filterDate'];
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
// 高级搜索
export const ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['account.advance.search.userSearchType'],
    value: 'userSearchType',
    fieldType: 'userLevel',
    conditions: ['EQ'],
    default: true,
    mainFilter: true,
    unique: true
  },
  // {
  //   label: '用户树归属',
  //   value: 'userId',
  //   fieldType: 'userTree',
  //   // additions: { module: 'account' }, //传递给UserLevelSelector的参数
  //   conditions: ['EQ'],
  //   default: true,
  //   mainFilter: true
  // },
  {
    label: i18n['report.user_earning_download.user_level'],
    value: 'levelId',
    fieldType: 'select',
    conditions: ['EQ'],
    key: 'levelId',
    default: true,
    index: 2
  },
  {
    label: i18n['usermgmt.date.create_time'],
    value: 'filterDate',
    fieldType: 'date',
    conditions: ['BETWEEN'],
    rangeConditions: true,
    key: 'filterDate',
    default: true,
    index: 3
  },
  {
    label: i18n['usermgmt.search_type.user_name'],
    value: 'name',
    fieldType: 'input',
    conditions: ['REGEX'],
    key: 'name'
  },
  {
    label: i18n['usermgmt.search_type.login'],
    value: 'login',
    fieldType: 'input',
    conditions: ['REGEX'],
    key: 'login'
  },
  {
    label: i18n['usermgmt.search_type.entity_number'],
    value: 'entityNo',
    fieldType: 'input',
    conditions: ['REGEX'],
    key: 'entityNo'
  },
  {
    label: i18n['usermgmt.search_type.higher_user'],
    value: 'parentName',
    fieldType: 'input',
    conditions: ['REGEX'],
    key: 'parentName',
    default: true
  },
  {
    label: i18n['usermgmt.search_type.role'],
    value: 'roleName',
    fieldType: 'input',
    conditions: ['REGEX'],
    key: 'roleName',
    default: true
  },
  {
    label: i18n['usermgmt.search_type.email'],
    value: 'email',
    fieldType: 'input',
    conditions: ['REGEX'],
    key: 'email'
  },
  {
    label: i18n['usermgmt.search_type.phone'],
    value: 'phones',
    fieldType: 'input',
    conditions: ['REGEX'],
    key: 'phones'
  }
];

export const COMMISSION_FIELD_KEYS = ['vendorServerId', 'login'];
export const EDITABLE_FIELDS = {
  name: true
};
