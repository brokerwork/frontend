import i18n from 'utils/i18n';

export const TRASH_HEADER_FIELDS = [
  {
    key: 'customName',
    label: i18n['customer.fields.customer_name']
  },
  {
    key: 'customNo',
    label: i18n['customer.fields.customer_no']
  },
  {
    key: 'email',
    label: i18n['customer.fields.email']
  },
  {
    key: 'phones',
    label: i18n['customer.fields.phones']
  },

  {
    key: 'modifyTime',
    label: i18n['customer.trash.delete_time']
  },
  { key: 'removeReason', label: i18n['customer.trash.delete_reason'] },
  { key: 'customerState', label: i18n['customer.trash.state_before_deleted'] }
];

export const TRANSH_TIME_SEARCH_TYPE = [
  { label: i18n['customer.trash.delete_time'], value: 'DeleteTime' }
];

export const SELECTABLED_CUSTOMER_STATE_TYPES = {
  inner: [
    { label: i18n['customer.state_type.active'], value: 'Active' },
    { label: i18n['customer.state_type.clue'], value: 'Clue' },
    { label: i18n['customer.state_type.potential'], value: 'Potential' },
    { label: i18n['customer.state_type.signed'], value: 'Signed' },
    { label: i18n['customer.state_type.payed'], value: 'Payed' },
    {
      label: i18n['customer.state_type.lost'],
      value: 'Lost'
    }
  ],
  outer: []
};

export const FUZZY_SEARCH_TYPES = [
  {
    label: i18n['customer.fuzzy_search_type.customer_name'],
    value: 'CustomerName'
  },
  {
    label: i18n['customer.fuzzy_search_type.customer_id'],
    value: 'CustomerId'
  },
  { label: i18n['customer.fuzzy_search_type.phone'], value: 'Phone' },
  { label: i18n['customer.fuzzy_search_type.email'], value: 'Mail' }
];

export const ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['customer.trash.delete_time'],
    value: 'modifyTime',
    conditions: ['EQ', 'NEQ', 'GT', 'LT', 'BETWEEN'],
    fieldType: 'date',
    rangeConditions: ['BETWEEN']
  },
  {
    label: i18n['customer.advanced_search.field.customName'],
    value: 'customName',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX']
  },
  {
    label: i18n['customer.advanced_search.field.customNo'],
    value: 'customNo',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX']
  },
  {
    label: i18n['customer.advanced_search.field.phones'],
    value: 'phones',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX']
  },
  {
    label: i18n['customer.advanced_search.field.email'],
    value: 'email',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX']
  }
];

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

export const ADVANCED_SEARCH_CONFIG = {
  conditionKey: 'opt', //条件的key
  dateSplit: '~' // 时间分隔符
};
