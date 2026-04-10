import i18n from 'utils/i18n';

export const VERIFY_STATE_MAP = {
  UNVERIFIED: 'UNVERIFIED',
  SUCCESSED: 'SUCCESSED',
  FAILED: 'FAILED',
  VERIFING: 'VERIFING'
};

export const VERIFY_ICON_MAP = {
  UNVERIFIED: 'verification',
  SUCCESSED: 'verification-successful',
  FAILED: 'verification-failed',
  VERIFING: 'circle-o-notch'
};

export const VERIFY_BUTTON_TEXT_MAP = {
  UNVERIFIED: i18n['verification.button.verification'],
  SUCCESSED: i18n['verification.button.verification-successful'],
  FAILED: i18n['verification.button.verification-failed'],
  VERIFING: i18n['verification.button.verifing']
};

export const OPTIONS_TO_VERIFY = [
  {
    key: 'idNum',
    label: i18n['verification.label.id_number'],
    type: 'ID_CARD',
    title: i18n['verification.title.id_card']
  },
  {
    key: 'accountNo',
    label: i18n['verification.label.account_no'],
    type: 'BANK_CARD',
    title: i18n['verification.title.bank_card']
  }
];

export const TYPE_KEY_MAP = {
  ID_CARD: 'idNum',
  BANK_CARD: 'accountNo'
};

export const KEY_TYPE_MAP = {
  idNum: 'ID_CARD',
  accountNo: 'BANK_CARD'
};

export const CARD_LABEL_REGEXP = {
  idNum: [
    '身份证',
    'ID Card',
    '身份證',
    '身分証明書',
    'id card',
    'Id Card',
    'ID card',
    'id Card'
  ]
};
