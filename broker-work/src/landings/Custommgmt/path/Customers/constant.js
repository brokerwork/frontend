import i18n from 'utils/i18n';
import { dateRange } from 'utils/config';
import cs from './components/CustomerDetail/ApproveModal/ApproveForm.less';

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

//开户状态可选列表
export const OPEN_STATE_OPTION_LIST = [
  { label: i18n['customer.state_type.openState1'], value: 1 },
  { label: i18n['customer.state_type.openState2'], value: 2 },
  { label: i18n['customer.state_type.openState3'], value: 3 }
];

//交易状态可选列表
export const DEAL_STATE_OPTION_LIST = [
  { label: i18n['customer.state_type.dealState1'], value: 1 },
  { label: i18n['customer.state_type.dealState2'], value: 2 }
];

// 高级搜索
export const ADVANCED_SEARCH_TYPE = [
  // { label: i18n['customer.advanced_search.field.oweId'], value: 'oweId', fieldType: 'user', conditions: ['IN', 'NIN'], key: 'oweId', index: 1},
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
    label: i18n['customer.advanced_search.field.createTime'],
    value: 'createTime',
    fieldType: 'date',
    conditions: ['EQ', 'NEQ', 'GT', 'LT', 'BETWEEN'],
    key: 'createTime',
    rangeConditions: ['BETWEEN']
  },
  // {
  //   label: i18n['customer.advanced_search.field.createTime'],
  //   value: 'aaaa',
  //   fieldType: 'date',
  //   conditions: ['EQ', 'NEQ', 'GT', 'LT', 'BETWEEN'],
  //   key: 'createTime',
  //   rangeConditions: ['BETWEEN']
  // },
  {
    label: i18n['customer.advanced_search.field.revisitTime'],
    value: 'revisitTime',
    fieldType: 'date',
    conditions: ['EQ', 'NEQ', 'GT', 'LT', 'BETWEEN'],
    key: 'revisitTime',
    rangeConditions: ['BETWEEN'],
    default: true
  },
  {
    label: i18n['customer.advanced_search.field.followTime'],
    value: 'followTime',
    fieldType: 'date',
    conditions: ['EQ', 'NEQ', 'GT', 'LT', 'BETWEEN'],
    key: 'followTime',
    rangeConditions: ['BETWEEN']
  },
  {
    label: i18n['customer.advanced_search.field.customName'],
    value: 'customName',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'customName'
  },
  {
    label: i18n['customer.advanced_search.field.oweId'],
    value: 'oweId',
    fieldType: 'user',
    conditions: ['IN', 'NIN'],
    key: 'oweId'
  },
  {
    label: i18n['customer.advanced_search.field.customNo'],
    value: 'customNo',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'customNo'
  },
  {
    label: i18n['customer.advanced_search.field.phones'],
    value: 'phones',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'phones'
  },
  {
    label: i18n['customer.advanced_search.field.email'],
    value: 'email',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'email'
  },
  {
    label: i18n['customer.fuzzy_search_type.real_account'],
    value: 'realAccount',
    default: true,
    fieldType: 'input',
    conditions: ['EQ']
  },
  {
    label: i18n['customer.state_type'],
    value: 'customerState',
    default: true,
    fieldType: 'select',
    conditions: ['EQ']
  },
  {
    label: i18n['adaptive_test.item_sub_title.state'], //开户状态
    value: 'openState',
    default: true,
    fieldType: 'select',
    optionList: OPEN_STATE_OPTION_LIST,
    conditions: ['EQ']
  },
  {
    label: i18n['customer.state_type.tradingStatus'], //交易状态
    value: 'dealState',
    default: true,
    fieldType: 'select',
    optionList: DEAL_STATE_OPTION_LIST,
    conditions: ['EQ']
  },
  {
    label: i18n['customer.advanced_search.field.customSource'],
    value: 'customSource',
    fieldType: 'select',
    conditions: ['IN', 'NIN'],
    key: 'customSource'
  },
  {
    label: i18n['customer.advanced_search.field.customerLevel'],
    value: 'customerLevel',
    fieldType: 'select',
    conditions: ['IN', 'NIN'],
    key: 'customerLevel'
  },
  {
    label: i18n['customer.advanced_search.field.customerType'],
    value: 'customerType',
    fieldType: 'select',
    conditions: ['IN', 'NIN'],
    key: 'customerType'
  },
  {
    label: i18n['customer.advanced_search.field.ambitious'],
    value: 'ambitious',
    fieldType: 'select',
    conditions: ['IN', 'NIN'],
    key: 'ambitious'
  },
  {
    label: i18n['customer.advanced_search.field.introducer'],
    value: 'introducer',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'introducer'
  },
  //now

  {
    label: i18n['customer.advanced_search.field.idType'],
    value: 'idType',
    fieldType: 'select',
    conditions: ['IN', 'NIN'],
    key: 'idType'
  },

  {
    label: i18n['customer.advanced_search.field.idNum'],
    value: 'idNum',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'idNum'
  },
  {
    label: i18n['customer.advanced_search.field.faxes'],
    value: 'faxes',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'faxes'
  },
  {
    label: i18n['customer.advanced_search.field.site'],
    value: 'site',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'site'
  },
  {
    label: i18n['customer.advanced_search.field.social'],
    value: 'social',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'social'
  },
  {
    label: i18n['customer.advanced_search.field.postcode'],
    value: 'postcode',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'postcode'
  },
  {
    label: i18n['customer.advanced_search.field.address'],
    value: 'address',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'address'
  },
  {
    label: i18n['customer.advanced_search.field.comments'],
    value: 'comments',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'comments'
  },

  {
    label: i18n['customer.advanced_search.field.country'],
    value: 'country',
    fieldType: 'city',
    conditions: ['EQ', 'NEQ'],
    key: 'country'
  },
  {
    label: i18n['customer.advanced_search.field.followContent'],
    value: 'followContent',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'REGEX'],
    key: 'followContent'
  },
  {
    label: i18n['customer.fuzzy_search_type.participant'],
    value: 'participant',
    fieldType: 'user',
    conditions: ['REGEX'],
    key: 'participant',
    additions: { checkbox: true, selectAllButton: true, defaultSelect: false }
  },
  {
    label: i18n['customer.fields.commendName'],
    value: 'commendName',
    fieldType: 'customer',
    conditions: ['IN'],
    key: 'commendName',
    additions: { checkbox: true, selectAllButton: true, defaultSelect: false }
  },
  {
    label: i18n['customer.advanced_search.field.recommendedCustomerNum'],
    value: 'recommendedCustomerNum',
    fieldType: 'number',
    conditions: ['EQ', 'NEQ', 'GT'],
    key: 'recommendedCustomerNum',
    default: true,
    placeholder: i18n['general.number_placeholder']
  },
  {
    value: 'customerText1',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ'],
    key: 'customerText1'
  },
  {
    value: 'customerText2',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ'],
    key: 'customerText2'
  },
  {
    value: 'customerSelect1',
    fieldType: 'select',
    conditions: ['IN', 'NIN'],
    key: 'customerSelect1'
  },
  {
    value: 'customerSelect2',
    fieldType: 'select',
    conditions: ['IN', 'NIN'],
    key: 'customerSelect2'
  }

  // { label: i18n['customer.fuzzy_search_type.demo_account'], value: 'demoAccount', default: true, fieldType: 'input', conditions: ['EQ'], index: 25 }
];

export const ADVANCED_SEARCH_TIME_TYPE = [
  'createTime',
  'revisitTime',
  'followTime'
];

// 客户筛选条件
export const ACTION_BAR_SEARCH_TYPE = [
  {
    label: i18n['customer.search_type.all'],
    value: 'all',
    right: 'CUSTOMER_SELECT_ALL'
  },
  {
    label: i18n['customer.search_type.direct'],
    value: 'direct',
    right: 'CUSTOMER_SELECT_DIRECTLY'
  },
  {
    label: i18n['customer.search_type.no_direct'],
    value: 'noDirect',
    right: 'CUSTOMER_SELECT_SUBORDINATE'
  },
  {
    label: i18n['customer.search_type.no_belonging'],
    value: 'noBelonging',
    right: 'CUSTOMER_SELECT_WILD'
  },
  { label: i18n['customer.search_type.followed'], value: 'followed' },
  {
    label: i18n['customer.search_type.participant'],
    value: 'participant',
    right: 'CUSTOMER_SELECT_JOIN'
  },
  {
    label: i18n['customer.state_type.subParticipant'],
    value: 'subParticipant',
    right: 'CUSTOMER_SELECT_SUBORDINATEJOIN'
  }
];

// 客户时间类型
export const CUSTOMER_TIME_SEARCH_TYPE = [
  { label: i18n['customer.contacts_module.create_time'], value: 'CreateTime' },
  {
    label: i18n['customer.advanced_search.field.revisitTime'],
    value: 'RevisitTime'
  },
  {
    label: i18n['customer.advanced_search.field.followTime'],
    value: 'FollowTime'
  }
];

export const ADVANCED_SEARCH_CONFIG = {
  searchType: 'BW_CUSTOMER',
  conditionKey: 'opt', //条件的key
  arraySplit: '@#$', //数组分隔符
  dateSplit: '~' // 时间分隔符
};

export const LOST_CUSTOMER_STATE = {
  label: i18n['customer.state_type.lost'],
  value: 'Lost'
};
//客户状态类型

// Clue,//销售线索
// Potential,//潜在客户
// Signed,//签约客户
// Payed,//付费客户
// Deal,//交易客户
export const CUSTOMER_STATE_TYPES = {
  inner: [
    { label: i18n['customer.state_type.active'], value: 'Active' }, //活跃客户，除去Lost的所有状态，发送请求时对应的是‘’（空）；
    { label: i18n['customer.state_type.clue'], value: 'Clue' },
    { label: i18n['customer.state_type.potential'], value: 'Potential' },
    { label: i18n['customer.state_type.signed'], value: 'Signed' },
    { label: i18n['customer.state_type.payed'], value: 'Payed' },
    LOST_CUSTOMER_STATE
  ],
  outer: [
    { label: i18n['customer.state_type'], value: '' },
    { label: i18n['customer.state_type.clue'], value: 'Clue' },
    { label: i18n['customer.state_type.potential'], value: 'Potential' },
    { label: i18n['customer.state_type.open'], value: 'Open' },
    { label: i18n['customer.state_type.deposit'], value: 'Deposit' },
    { label: i18n['customer.state_type.deal'], value: 'Deal' }
  ]
};

export const SELECTABLE_CUSTOMER_STATE_KEYS = {
  inner: ['Clue', 'Potential'],
  outer: ['Clue']
};

export const FUZZY_SEARCH_TYPES = [
  {
    label: i18n['customer.fuzzy_search_type.customer_name'],
    value: 'CustomerName'
  },
  { label: i18n['customer.fuzzy_search_type.own_name'], value: 'OwnName' },
  {
    label: i18n['customer.fuzzy_search_type.customer_id'],
    value: 'CustomerId'
  },
  { label: i18n['customer.fuzzy_search_type.phone'], value: 'Phone' },
  { label: i18n['customer.fuzzy_search_type.email'], value: 'Mail' },
  {
    label: i18n['customer.fuzzy_search_type.participant'],
    value: 'Participant'
  },
  {
    label: i18n['customer.fuzzy_search_type.real_account'],
    value: 'RealAccount'
  }
  // { label: i18n['customer.fuzzy_search_type.demo_account'], value: 'DemoAccount' }
];

export const REVISIT_RANGES = {
  [i18n['general.date_range_picker.option.today']]: dateRange.today,
  [i18n['customer.date_range.beyond_revisit_time']]: dateRange.untilYesterday,
  [i18n['customer.date_range.beyond_revisit_time_today']]: dateRange.untilToday,
  [i18n['customer.date_range.beyond_revisit_time_tomorrow']]:
    dateRange.tomorrow,
  [i18n['general.date_range_picker.option.currentMonth']]:
    dateRange.currentMonth,
  [i18n['customer.date_range.beyond_revisit_time_all']]:
    dateRange.allrevisitTime
};

export const DEFAULT_RANGES = {
  [i18n['general.date_range_picker.option.all']]: dateRange.all,
  [i18n['general.date_range_picker.option.today']]: dateRange.today,
  [i18n['general.date_range_picker.option.yestoday']]: dateRange.yestoday,
  [i18n['general.date_range_picker.option.last7days']]: dateRange.last7days,
  [i18n['general.date_range_picker.option.last30days']]: dateRange.last30days,
  [i18n['general.date_range_picker.option.currentMonth']]:
    dateRange.currentMonth,
  [i18n['general.date_range_picker.option.lastMonth']]: dateRange.lastMonth
};

export const DELETE_REASONS = [
  {
    label: i18n['customer.trash.delete_reason.duplicate'],
    value: '#*reason*#1'
  },
  {
    label: i18n['customer.trash.delete_reason.invalid'],
    value: '#*reason*#2'
  }
];

export const OWNER_RIGHTS_MAP = {
  sub: 'CUSTOMER_SELECT_DIRECTLY_OWNER',
  subBelong: 'CUSTOMER_SELECT_SUBORDINATE_OWNER',
  noParent: 'CUSTOMER_SELECT_WILD_OWNER',
  all: 'CUSTOMER_SELECT_ALL_OWNER',
  participant: 'CUSTOMER_SELECT_JOIN_OWNER'
};

export const AREA_FIELD_OPTION_LIST = [
  {
    label:
      i18n['customer.detail.inner_field.area.option_list.chinese_mainland'],
    value: 'chinese_mainland'
  },
  {
    label: i18n['customer.detail.inner_field.area.option_list.hk_tw_macao'],
    value: 'hk_tw_macao'
  },
  {
    label: i18n['customer.detail.inner_field.area.option_list.asian'],
    value: 'asian'
  },
  {
    label: i18n['customer.detail.inner_field.area.option_list.europe'],
    value: 'europe'
  },
  {
    label: i18n['customer.detail.inner_field.area.option_list.mid_east'],
    value: 'mid_east'
  },
  {
    label: i18n['customer.detail.inner_field.area.option_list.africa'],
    value: 'africa'
  },
  {
    label: i18n['customer.detail.inner_field.area.option_list.other'],
    value: 'other'
  }
];
export const INNER_CUSTOMER_MORE_FIELDS = [
  {
    key: 'brand',
    label: i18n['customer.detail.inner_field.brand'],
    columns: 1
  },
  {
    key: 'area',
    fieldType: 'select',
    optionList: AREA_FIELD_OPTION_LIST,
    label: i18n['customer.detail.inner_field.area'],
    columns: 1,
    validateType: {
      required: true
    }
  },
  {
    key: 'local',
    label: i18n['customer.detail.inner_field.local'],
    fieldType: 'city',
    columns: 1
  },
  {
    key: 'postcode',
    label: i18n['customer.detail.inner_field.postcode'],
    columns: 1
  },
  {
    key: 'address',
    label: i18n['customer.detail.inner_field.address']
  },
  {
    key: 'regulator',
    label: i18n['customer.detail.inner_field.regulator'],
    columns: 1
  },
  {
    key: 'regulationNo',
    label: i18n['customer.detail.inner_field.regulationNo'],
    columns: 1
  }
];
export const LOST_REASONS = [
  { label: i18n['customer.lost_type.customer'], value: 'Customer' },
  { label: i18n['customer.lost_type.product'], value: 'Product' },
  { label: i18n['customer.lost_type.price'], value: 'Price' },
  { label: i18n['customer.lost_type.other'], value: 'Other' }
];

export const EDITABLE_FIELDS = {
  customName: true
};

const required = {
  validateType: {
    required: true
  }
};
const select = {
  fieldType: 'select',
  optionList: []
};
export const APPROVE_DEPT = [
  {
    value: 'cn',
    label: i18n['customer.approve_field.dept.cn']
  },
  {
    value: 'hk',
    label: i18n['customer.approve_field.dept.hk']
  },
  {
    value: 'other',
    label: i18n['customer.approve_field.dept.other']
  }
];

export const APPROVE_FIELDS_MAP = {
  approveType: {
    label: i18n['customer.approve_field.type'],
    readonly: true,
    ...required
  },
  dept: {
    label: i18n['customer.approve_field.dept'],
    ...select,
    optionList: APPROVE_DEPT
  },
  approver1: {
    label: i18n['customer.approve_field.approver1'],
    fieldType: 'approver1',
    component: {
      key: 'approver1',
      factory: (input, disabled) => {
        return (
          <div className={cs['period-container']}>
            <input className={cs['num-input']} {...input} disabled={disabled} />
            <div>{'@lwork.com'}</div>
          </div>
        );
      }
    }
  },
  approver2: {
    label: i18n['customer.approve_field.approver2'],
    fieldType: 'approver2',
    component: {
      key: 'approver2',
      factory: (input, disabled) => {
        return (
          <div className={cs['period-container']}>
            <input className={cs['num-input']} {...input} disabled={disabled} />
            <div>{'@lwork.com'}</div>
          </div>
        );
      }
    }
  },
  approver3: {
    label: i18n['customer.approve_field.approver3'],
    fieldType: 'approver3',
    component: {
      key: 'approver3',
      factory: (input, disabled) => {
        return (
          <div className={cs['period-container']}>
            <input className={cs['num-input']} {...input} disabled={disabled} />
            <div>{'@lwork.com'}</div>
          </div>
        );
      }
    }
  },
  approver4: {
    label: i18n['customer.approve_field.approver4'],
    fieldType: 'approver4',
    component: {
      key: 'approver4',
      factory: (input, disabled) => {
        return (
          <div className={cs['period-container']}>
            <input className={cs['num-input']} {...input} disabled={disabled} />
            <div>{'@lwork.com'}</div>
          </div>
        );
      }
    }
  },
  approver5: {
    label: i18n['customer.approve_field.approver5'],
    fieldType: 'approver5',
    component: {
      key: 'approver5',
      factory: (input, disabled) => {
        return (
          <div className={cs['period-container']}>
            <input className={cs['num-input']} {...input} disabled={disabled} />
            <div>{'@lwork.com'}</div>
          </div>
        );
      }
    }
  },
  cclist: {
    label: i18n['customer.approve_field.cc'],
    placeHolder: i18n['customer.approve_field.cc.placeholder']
  }
};
