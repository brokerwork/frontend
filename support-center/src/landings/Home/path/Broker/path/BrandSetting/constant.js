import i18n from 'utils/i18n';

export const NAV_LEVEL = [
  { label: i18n['twapp.brand_setting.custom_nav.first_nav'], value: 'one' },
  { label: i18n['twapp.brand_setting.custom_nav.second_nav'], value: 'two' }
];
export const NAV_UPPER_OPTIONS = [
  { label: i18n['twapp.brand_setting.custom_nav.upper.live'], value: '0' },
  { label: i18n['twapp.brand_setting.custom_nav.upper.viewpoint'], value: '1' },
  { label: i18n['twapp.brand_setting.custom_nav.upper.other'], value: '2' }
];
export const NAV_CONTENT_TYPES = [
  { label: i18n['twapp.brand_setting.custom_nav.content_system_default'], value: 'SYSTEM' },
  { label: i18n['twapp.brand_setting.custom_nav.content_custom'], value: 'CUSTOM' }
];
export const NAV_CUSTOM_CONTENT_TYPES = [
  { label: i18n['twapp.brand_setting.custom_nav.content_custom.link'], value: 'LINK' },
  { label: i18n['twapp.brand_setting.custom_nav.content_custom.input'], value: 'CONTENT' }
];

export const NAC_CUSTOM_TABLE_HEADER = [
  { key: '1', value: i18n['twapp.brand_setting.first_level'] },
  { key: '2', value: i18n['twapp.brand_setting.second_level'] },
  { key: 'type', value: i18n['twapp.brand_setting.nav_type'] },
  { key: 'enabled', value: i18n['twapp.brand_setting.nav_status'] },
  { key: 'source', value: i18n['twapp.brand_setting.nav_source'] }
];

export const NAV_AUTH_MODAL_ROLE = [
  { label: i18n['broker.brand_setting.custom_nav.role.all'], value: 'all' },
  { label: i18n['broker.brand_setting.custom_nav.role.part'], value: 'part' }
];
