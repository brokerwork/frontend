import i18n from 'utils/i18n';

export const EMAIL_PROVIDER = [
  { label: 'SendCloud', value: 'SendCloud' },
  { label: i18n['email.setting.provider.ali'], value: 'Alibaba' },
  { label: i18n['email.setting.provider.tencent'], value: 'Tencent' },
  { label: i18n['email.setting.provider.tencent_co'], value: 'Tencent_co' },
  { label: i18n['email.setting.provider.tencent_co_hw'], value: 'Tencent_co_hw' },
  { label: i18n['email.setting.provider.wangyi'], value: 'WangYi' },
  { label: i18n['email.setting.provider.wangyi_co'], value: 'WangYi_co' },
  { label: i18n['email.setting.provider.wangyi_co_free'], value: 'WangYi_co_free' },
  { label: i18n['email.setting.provider.sinc_co'], value: 'Sina_co' },
  { label: 'Office 365', value: 'Office365' },
  { label: i18n['email.setting.provider.gmail'], value: 'Gmail' },
  { label: i18n['email.setting.provider.global_mail'], value: 'Global_mail' },
  { label: i18n['email.setting.provider.custom'], value: 'Custom', default: true }
];

export const SECURITY_TYPE = [
  { label: 'SSL', value: 'SSL' },
  { label: 'TLS', value: 'TLS' }
];