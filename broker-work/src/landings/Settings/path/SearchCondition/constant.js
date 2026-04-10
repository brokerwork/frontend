import i18n from 'utils/i18n';
// 高级搜索条件
export const ADVANCED_SEARCH_CONDITIONS = [
  { label: i18n['customer.advanced_search.conditions.eq'], value: 'EQ' },
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

// 高级搜索默认条件optionslist
export const CONDITIONS_OPTIONS_LIST = [
  { label: i18n['settings.conditions_setting.settings_yes'], value: 'true' },
  { label: i18n['settings.conditions_setting.settings_no'], value: 'false' }
];

// 高级搜索默认条件
export const DEFAULT_CONDITIONS = [
  {
    label: i18n['settings.conditions_setting.settings_deposite_amount'],
    value: 'depositAmount',
    fieldType: 'input',
    key: 'depositAmount',
    conditions: ['EQ', 'NEQ', 'LT', 'GT']
  },
  {
    label: i18n['settings.conditions_setting.settings_open_trader'],
    value: 'registerTW',
    fieldType: 'select',
    key: 'registerTW',
    conditions: ['EQ'],
    optionList: CONDITIONS_OPTIONS_LIST
  },
  {
    label: i18n['settings.conditions_setting.settings_open_demo'],
    value: 'registerDemo',
    fieldType: 'select',
    key: 'registerDemo',
    conditions: ['EQ'],
    optionList: CONDITIONS_OPTIONS_LIST
  },
  {
    label: i18n['settings.conditions_setting.settings_open_real'],
    value: 'registerReal',
    fieldType: 'select',
    key: 'registerReal',
    conditions: ['EQ'],
    optionList: CONDITIONS_OPTIONS_LIST
  }
];

export const NEEDLESS_FIELD = [
  'participant',
  'oweId',
  'phones',
  'email',
  'idNum',
  'idUrl1',
  'idUrl2',
  'faxes',
  'site',
  'social',
  'im',
  'idAddress',
  'standbyTelephone'
];

export const ADVANCED_SEARCH_TIME_TYPE = [
  'createTime',
  'revisitTime',
  'followTime'
];

export const FIELD_TABLE_NAME = {
  account:
    't_account_account,t_account_profiles,t_account_finacial,t_account_id_info',
  cbroker:
    't_account_cbroker,t_account_profiles,t_account_finacial,t_account_id_info'
};
