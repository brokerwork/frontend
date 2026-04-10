import i18n from 'utils/i18n';

export const PRIVILEGE_TYPE = [
  {
    label: i18n['account.privilege_type.all'],
    value: 'all',
    right: 'ACCOUNT_SELECT_ALL'
  },
  {
    label: i18n['account.privilege_type.sub'],
    value: 'sub',
    right: 'ACCOUNT_SELECT_DIRECTLY'
  },
  {
    label: i18n['account.privilege_type.sub_belong'],
    value: 'subBelong',
    right: 'ACCOUNT_SELECT_SUBORDINATE'
  },
  {
    label: i18n['account.privilege_type.no_parent'],
    value: 'noParent',
    right: 'ACCOUNT_SELECT_WILD'
  }
];

export const SEARCH_TYPE = [
  { label: i18n['account.search_type.account_name'], value: 'accountName' },
  { label: i18n['account.search_type.account'], value: 'account' },
  { label: i18n['account.search_type.user_name'], value: 'userName' }
];

export const ADVANCED_SEARCH_CONFIG = {
  searchType: 'BW_ACCOUNT',
  arraySplit: '@#$', //数组分隔符
  dateSplit: '@#$', // 时间分隔符
  rangeSplit: '@#$'
};

export const ADVANCED_SEARCH_TYPE = [
  {
    label: i18n['account.advance.search.userSearchType'],
    value: 'userSearchType',
    fieldType: 'userLevel',
    conditions: ['EQ'],
    default: true,
    mainFilter: true
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userSearchType',
    fieldType: 'simpleSelect',
    conditions: ['EQ'],
    default: true,
    mainFilter: true,
    addToTop: true
  },
  {
    label: i18n['account.search_type.account_name'],
    value: 'accountName',
    fieldType: 'input',
    conditions: ['EQ', 'CONTAIN'],
    default: true
  },
  {
    label: i18n['account.search_type.account'],
    value: 'account',
    fieldType: 'input',
    conditions: ['EQ', 'CONTAIN', 'GT', 'LT', 'BETWEEN'],
    default: true,
    rangeConditions: ['BETWEEN']
  },
  // { label: i18n['account.search_type.user_name'], value: 'userName', fieldType: 'input', conditions: ['EQ', 'CONTAIN'], default: true },
  {
    label: i18n['account.advanced_search.field.group'],
    value: 'group',
    fieldType: 'select',
    conditions: ['EQ'],
    key: 'accountInfo.group',
    additions: { searchable: true, checkbox: true, selectAllButton: true }
  },
  {
    label: i18n['account.advanced_search.field.leverage'],
    value: 'leverage',
    fieldType: 'select',
    conditions: ['EQ', 'NEQ'],
    key: 'accountInfo.leverage',
    additions: { checkbox: true, selectAllButton: true }
  },
  {
    label: i18n['account.advanced_search.field.user_group'],
    value: 'userGroup',
    fieldType: 'select',
    conditions: ['EQ', 'NIN', 'EMPTY'],
    key: 'accountInfo.userGroup',
    additions: { searchable: true, checkbox: true, selectAllButton: true }
  },
  //cbrocker
  //不再区分t_account_cbroker 与 t_account_account 后 属于重复的。
  // {
  //   label: i18n['account.advanced_search.field.group_cbroker'],
  //   value: 'group',
  //   fieldType: 'select',
  //   conditions: ['EQ'],
  //   key: 't_account_cbroker.group',
  //   additions: { searchable: true, checkbox: true, selectAllButton: true }
  // },
  // {
  //   label: i18n['account.advanced_search.field.leverage'],
  //   value: 'leverage',
  //   fieldType: 'select',
  //   conditions: ['EQ', 'NEQ'],
  //   key: 't_account_cbroker.leverage',
  //   additions: { checkbox: true, selectAllButton: true }
  // },
  // {
  //   label: i18n['account.advanced_search.field.user_group'],
  //   value: 'userGroup',
  //   fieldType: 'select',
  //   conditions: ['EQ', 'NIN', 'EMPTY'],
  //   key: 't_account_cbroker.userGroup',
  //   additions: { searchable: true, checkbox: true, selectAllButton: true }
  // },
  //cbrocker
  {
    label: i18n['account.advanced_search.field.customer_name'],
    value: 'customerName',
    fieldType: 'customer',
    conditions: ['EQ'],
    default: true,
    additions: { searchable: 'customer' }
  },
  {
    label: i18n['account.advanced_search.field.email'],
    value: 'email',
    fieldType: 'input',
    conditions: ['EQ', 'CONTAIN'],
    key: 'baseInfo.email'
  },
  {
    label: i18n['account.advanced_search.field.phones'],
    value: 'phones',
    fieldType: 'input',
    conditions: ['EQ', 'CONTAIN'],
    key: 'baseInfo.phones'
  },
  {
    label: i18n['account.advanced_search.field.remark'],
    value: 'remark',
    fieldType: 'input',
    conditions: ['EQ', 'CONTAIN'],
    key: 'baseInfo.remark'
  },
  {
    label: i18n['account.advanced_search.field.city'],
    value: 'city',
    fieldType: 'city',
    conditions: ['EQ'],
    key: 'baseInfo.residence',
    additions: { searchable: true }
  },
  {
    label: i18n['account.advanced_search.field.address'],
    value: 'address',
    fieldType: 'input',
    conditions: ['EQ', 'CONTAIN'],
    key: 'baseInfo.address'
  },
  {
    label: i18n['account.advanced_search.field.balance'],
    value: 'balance',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'GT', 'LT'],
    default: true
  },
  {
    label: i18n['account.advanced_search.field.profit'],
    value: 'profit',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'GT', 'LT'],
    default: true
  },
  {
    label: i18n['account.advanced_search.field.equity'],
    value: 'equity',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'GT', 'LT'],
    default: true
  },
  {
    label: i18n['account.advanced_search.field.credit'],
    value: 'credit',
    fieldType: 'input',
    conditions: ['EQ', 'NEQ', 'GT', 'LT'],
    default: true
  },
  {
    label: i18n['account.advanced_search.field.email'],
    value: 'email',
    fieldType: 'input',
    conditions: ['EQ', 'CONTAIN'],
    default: true
  },
  {
    label: i18n['account.advanced_search.field.phones'],
    value: 'phones',
    fieldType: 'input',
    conditions: ['EQ', 'CONTAIN'],
    default: true
  },
  {
    label: i18n['account.advanced_search.field.user_name'],
    value: 'userId',
    fieldType: 'user',
    conditions: ['EQ'],
    default: true
  },
  {
    label: i18n['account.date_range_type.create'],
    value: 'regdate',
    fieldType: 'date',
    conditions: ['BETWEEN'],
    key: 'regdate',
    rangeConditions: ['BETWEEN'],
    default: true
  },
  {
    label: i18n['setting.operation.log.BW_LT_010'],
    fieldType: 'select',
    key: 'readOnly',
    value: 'readOnly',
    conditions: ['EQ'],
    optionList: [
      { value: 0, label: i18n['general.open'] },
      { value: 1, label: i18n['general.close'] }
    ],
    default: true
  },
  {
    label: i18n['setting.operation.log.BW_LT_011'],
    fieldType: 'select',
    key: 'enable',
    value: 'enable',
    conditions: ['EQ'],
    optionList: [
      { value: 1, label: i18n['general.open'] },
      { value: 0, label: i18n['general.close'] }
    ],
    default: true
  },
  {
    label: i18n['account.advanced_search.field.custom_account_type'],
    fieldType: 'select',
    key: 'customAccountType',
    value: 'customAccountType',
    conditions: ['EQ'],
    optionList: [],
    default: true
  }
];

export const ADVANCED_SEARCH_CONDITIONS = [
  {
    label: '=',
    value: 'EQ'
  },
  { label: '≠', value: 'NEQ' },
  {
    label: i18n['account.advanced_search.conditions.contain'],
    value: 'CONTAIN'
  },
  { label: '>', value: 'GT' },
  { label: '<', value: 'LT' },
  {
    label: '<>',
    value: 'BETWEEN'
  },
  { label: i18n['account.advanced_search.conditions.nin'], value: 'NIN' },
  {
    label: i18n['account.advanced_search.conditions.empty'],
    value: 'EMPTY',
    valueDisabled: true
  }
];

export const sortColumns = [
  'login',
  'regdate',
  'marginFree',
  'margin',
  'marginLevel',
  'balance',
  'equity',
  'profit',
  'credit'
];
export const statusColumns = [
  'readOnly',
  'enable',
  'sendReports',
  'enableOtp',
  'enableTrailingStop',
  'enableEa',
  'updatePasswordNextTime',
  'enableChangePassword'
];
export const assetsColumns = [
  'balance',
  'profit',
  'equity',
  'credit',
  'margin',
  'marginLevel',
  'marginFree'
];

export const mtColums = ['group'];

export const otherAccountColums = ['userName', 'enable', 'readOnly']; // 账户归属、杠杆、登陆状态、交易状态

export const grpColums = ['userGroup'];

export const leverageColums = ['leverage'];
