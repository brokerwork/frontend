import i18n from 'utils/i18n';

// 销售机会归属类型
export const SALES_OPPORTUNITY_FILTER_TYPE = [
  {
    label: i18n['customer.sales_opportunity.filter_type.all'],
    value: 'all',
    right: 'CUSTOMER_SALEOPP_SELECT_ALL'
  },
  {
    label: i18n['customer.sales_opportunity.filter_type.direct'],
    value: 'direct',
    right: 'CUSTOMER_SALEOPP_SELECT_DIRECTLY'
  },
  {
    label: i18n['customer.sales_opportunity.filter_type.no_direct'],
    value: 'noDirect',
    right: 'CUSTOMER_SALEOPP_SELECT_SUBORDINATE'
  },
  {
    label: i18n['customer.sales_opportunity.filter_type.noBelonging'],
    value: 'noBelonging',
    right: 'CUSTOMER_SALEOPP_SELECT_WILD'
  }
];

// 销售机会搜索类型
export const SALES_OPPORTUNITY_SEARCH_TYPE = [
  {
    label: i18n['customer.sales_opportunity.search_type.customer_name'],
    value: 'CustomerName'
  },
  {
    label: i18n['customer.sales_opportunity.search_type.opp_name'],
    value: 'OppName'
  },
  {
    label: i18n['customer.sales_opportunity.search_type.own_name'],
    value: 'OwnName'
  }
];

// 高级搜索条件
export const ADVANCED_SEARCH_CONDITIONS = [
  {
    label: i18n['customer.advanced_search.conditions.eq'],
    value: 'EQ'
  },
  { label: i18n['customer.advanced_search.conditions.eq'], value: 'IN' },
  { label: i18n['customer.advanced_search.conditions.neq'], value: 'NEQ' },
  { label: i18n['customer.advanced_search.conditions.neq'], value: 'NIN' },
  { label: i18n['customer.advanced_search.conditions.regex'], value: 'REGEX' },
  { label: i18n['customer.advanced_search.conditions.gt'], value: 'GT' },
  { label: i18n['customer.advanced_search.conditions.lt'], value: 'LT' },
  {
    label: i18n['customer.advanced_search.conditions.between'],
    value: 'BETWEEN'
  }
];

// 高级搜索
export const ADVANCED_SEARCH_TYPES = [
  // { label: i18n['customer.advanced_search.field.oweId'], value: 'oweId', fieldType: 'user', conditions: ['IN', 'NIN'], key: 'oweId', index: 1},
  {
    label: i18n['customer.advanced_search.field.filterType'],
    value: 'filterType',
    fieldType: 'select',
    conditions: ['EQ'],
    mainFilter: true
  },
  {
    label: i18n['customer.detail.sales_stage_label'],
    value: 'salesStage',
    fieldType: 'select',
    conditions: ['EQ']
  },
  {
    label: i18n['customer.sales_opportunity.search_type.customer_name'],
    value: 'customName',
    conditions: ['EQ']
  },
  {
    label: i18n['customer.sales_opportunity.search_type.opp_name'],
    value: 'opportunityName',
    conditions: ['EQ']
  },
  {
    label: i18n['customer.sales_opportunity.search_type.own_name'],
    value: 'oweName',
    conditions: ['EQ']
  }
];

export const ADVANCED_SEARCH_CONFIG = {
  conditionKey: 'opt' //条件的key
};
