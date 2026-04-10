import i18n from 'utils/i18n';

//联系人默认搜索字段
export const DEFAULT_SEARCH_TYPE = [
  {
    label: i18n['customer.contacts_module.contacts_name'],
    value: 'ContactName'
  },
  {
    label: i18n['customer.contacts_module.customer_name'],
    value: 'CustomerName'
  },
  { label: i18n['customer.contacts_module.email'], value: 'Mail' },
  { label: i18n['customer.contacts_module.contacts_phone'], value: 'Phone' },
  { label: i18n['customer.contacts_module.sub'], value: 'OwnName' }
];

//联系人筛选条件
export const PRIVILEGE_TYPE = [
  {
    label: i18n['customer.contacts_privilege_type.all'],
    value: 'all',
    right: 'CUSTOMER_CONTACTS_SELECT_ALL'
  },
  {
    label: i18n['customer.contacts_privilege_type.sub'],
    value: 'direct',
    right: 'CUSTOMER_CONTACTS_SELECT_DIRECTLY'
  },
  {
    label: i18n['customer.contacts_privilege_type.sub_belong'],
    value: 'noDirect',
    right: 'CUSTOMER_CONTACTS_SELECT_SUBORDINATE'
  },
  {
    label: i18n['customer.contacts_privilege_type.no_parent'],
    value: 'noBelonging',
    right: 'CUSTOMER_CONTACTS_SELECT_WILD'
  }
];
