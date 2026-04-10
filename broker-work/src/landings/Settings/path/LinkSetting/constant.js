import i18n from 'utils/i18n';

export const PLATFORM_LIST = [
  { label: i18n['settings.link_setting.platform_web'], value: 'Web' },
  { label: i18n['settings.link_setting.platform_mobile'], value: 'Mobile' }
];

export const STATUS_LIST = [
  { label: i18n['settings.link_setting.status_all'], value: '' },
  { label: i18n['settings.link_setting.status_disabled'], value: 'false' },
  { label: i18n['settings.link_setting.status_actived'], value: 'true' }
];

export const MOBILE_IDS = ['T001214', 'T001176'];

export const STRAIGHTGUEST_STATISTIC_HEADER = [
  { label: i18n['settings.link_setting.link_name'], value: 'name' },
  { label: i18n['settings.link_setting.target_url'], value: 'url' },
  { label: i18n['settings.link_setting.user_can_see'], value: 'userCanSee' },
  { label: i18n['task.details.field.server'], value: 'serverName' },
  { label: i18n['settings.link_setting.mt_group'], value: 'mtGroup' },
  { label: i18n['settings.link_setting.account_group'], value: 'accountGroup' },
  { label: i18n['settings.link_setting.leverge'], value: 'leverage' },
  { label: i18n['settings.link_setting.customerBelong'], value: 'ownerName' },
  {
    label: i18n['settings.link_setting.hit_count'],
    value: 'hit_count',
    visible: true
  },
  {
    label: i18n['settings.link_setting.new_count'],
    value: 'new_count',
    visible: true
  },
  {
    label: i18n['settings.link_setting.open_count'],
    value: 'open_count',
    visible: true
  },
  {
    label: i18n['settings.link_setting.deposite_count'],
    value: 'deposite_count',
    visible: true
  },
  {
    label: i18n['settings.link_setting.detail'],
    value: 'detail',
    visible: true
  }
];

export const XHB_STRAIGHTGUEST_STATISTIC_HEADER = [
  { label: i18n['settings.link_setting.link_name'], value: 'name' },
  { label: i18n['settings.link_setting.target_url'], value: 'url' },
  { label: i18n['settings.link_setting.user_can_see'], value: 'userCanSee' },
  { label: i18n['task.details.field.server'], value: 'serverName' },
  { label: i18n['settings.link_setting.mt_group'], value: 'mtGroup' },
  {
    label: i18n['settings.link_setting.customerBelong'],
    value: 'customerBelong'
  },
  {
    label: i18n['settings.link_setting.hit_count'],
    value: 'hit_count',
    visible: true
  },
  {
    label: i18n['settings.link_setting.new_count'],
    value: 'new_count',
    visible: true
  },
  {
    label: i18n['settings.link_setting.win_count'],
    value: 'win_count',
    visible: true
  },
  {
    label: i18n['settings.link_setting.detail'],
    value: 'detail',
    visible: true
  }
];

export const AGENT_STATISTIC_HEADER = [
  { label: i18n['settings.link_setting.link_name'], value: 'name' },
  { label: i18n['settings.link_setting.target_url'], value: 'url' },
  { label: i18n['settings.link_setting.user_can_see'], value: 'userCanSee' },
  {
    label: i18n['settings.link_setting.hit_count'],
    value: 'hit_count',
    visible: true
  },
  {
    label: i18n['settings.link_setting.applyNumber'],
    value: 'applyNumber',
    visible: true
  },
  {
    label: i18n['settings.link_setting.passNumber'],
    value: 'passNumber',
    visible: true
  },
  {
    label: i18n['settings.link_setting.notPassNumber'],
    value: 'notPassNumber',
    visible: true
  },
  {
    label: i18n['settings.link_setting.detail'],
    value: 'detail',
    visible: true
  }
];

export const WEB_HEADER = [
  { label: i18n['settings.link_setting.link_name'], value: 'name' },
  { label: i18n['settings.link_setting.target_url'], value: 'url' },
  { label: i18n['settings.link_setting.user_can_see'], value: 'userCanSee' },
  { label: i18n['settings.link_setting.create_time'], value: 'create_time' },
  { label: i18n['settings.link_setting.creator'], value: 'creator' },
  {
    label: i18n['settings.link_setting.link_action'],
    value: 'action',
    width: 120
  }
];

export const MOBILE_HEADER = [
  { label: i18n['settings.link_setting.link_name'], value: 'name' },
  { label: i18n['settings.link_setting.os'], value: 'os' },
  {
    label: i18n['settings.link_setting.software_package'],
    value: 'package'
  },
  { label: i18n['settings.link_setting.create_time'], value: 'create_time' },
  { label: i18n['settings.link_setting.creator'], value: 'creator' },
  {
    label: i18n['settings.link_setting.link_action'],
    value: 'action',
    width: 120
  }
];

// 其他推广类型的显示类型
export const BW_USER_SHOWOPTIONS = [
  {
    label: i18n['settings.link_setting.user_all_see'],
    value: 'UserAllVisible',
    showLink: false
  },
  {
    label: i18n['settings.link_setting.user_part_see'],
    value: 'UserPartVisible',
    showLink: true
  },
  {
    label: i18n['settings.link_setting.user_all_not_see'],
    value: 'UserNotVisible',
    showLink: false
  },
  {
    label: i18n['settings.link_setting.user_part_not_see'],
    value: 'UserInVisible',
    showLink: true
  }
];

// 直客推直客的显示类型
export const BW_DIRECT_USER_SHOW_OPTIONS = [
  {
    label: i18n['settings.link_setting.user_direct_all_see'],
    value: 'DirectAllVisible',
    showLink: false
  },
  {
    label: i18n['settings.link_setting.user_direct_part_see'],
    value: 'DirectPartVisible',
    showLink: true
  },
  {
    label: i18n['settings.link_setting.user_direct_all_not_see'],
    value: 'DirectNotVisible',
    showLink: false
  },
  {
    label: i18n['settings.link_setting.user_direct_part_not_see'],
    value: 'DirectPartInvisible',
    showLink: true
  }
];

// 直客推直客时的归属类型选择
export const CUSTOMER_BELONGS_TYPES = [
  {
    label: i18n['settings.link_setting.user_belong_none'],
    value: 'NoOwner'
  },
  {
    label: i18n['settings.link_setting.user_belong_link_onwer'],
    value: 'CustomerOwner'
  },
  {
    label: i18n['settings.link_setting.user_belong_others'],
    value: 'OtherOwner'
  }
];
