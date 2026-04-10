import i18n from 'utils/i18n';

export const FIELD_TABLE_NAME = {
  account:
    't_account_account,t_account_profiles,t_account_finacial,t_account_id_info',
  cbroker:
    't_account_cbroker,t_account_profiles,t_account_finacial,t_account_id_info'
};

export const NOTICE_KEY = 'ACCOUNT_NOTICE_KEY';

export const NOTICE_VERSION = '1.0';

export const OWNER_INFO_MODULE = [
  {
    label: i18n['account.edit_account.tabs.basic_info'],
    eventKey: 'baseInfo',
    right: 'baseInfo',
    form: 't_account_profiles'
  },
  {
    label: i18n['account.edit_account.tabs.financial_info'],
    eventKey: 'financialInfo',
    right: 'financialInfo',
    form: 't_account_finacial'
  },
  {
    label: i18n['account.edit_account.tabs.certificate_info'],
    eventKey: 'certificatesInfo',
    right: 'certificatesInfo',
    form: 't_account_id_info'
  },
  {
    label: i18n['account.edit_account.tabs.classification'],
    eventKey: 'classificationInfo',
    right: 'classificationInfo',
    form: 't_account_classification'
  }
];
