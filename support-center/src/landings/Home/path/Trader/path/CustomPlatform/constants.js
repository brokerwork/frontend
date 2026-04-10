import i18n from 'utils/i18n';

export const PLATFORM_TYPES = [
  { label: i18n['trader.customPlatform.form.type.forex'], value: 'FOREX' },
  { label: i18n['trader.customPlatform.form.type.security'], value: 'SECURITY' },
  { label: i18n['trader.customPlatform.form.type.futures'], value: 'FUTURES' }
];

export function getPlatFormTypeLabel(value) {
  const p = PLATFORM_TYPES.find(item => item.value === value);
  return p ? p.label : '';
}
