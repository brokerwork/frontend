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
export const OPTIONS_TO_VERIFY_MAP = {
  ID_CARD: {
    key: 'idNum',
    label: i18n['verification.label.id_number'],
    type: 'ID_CARD',
    title: i18n['verification.title.id_card']
  },
  BANK_CARD: {
    key: 'accountNo',
    label: i18n['verification.label.account_no'],
    type: 'BANK_CARD',
    title: i18n['verification.title.bank_card']
  },
  AUSTRALIA_DRIVING_LICENCE: {
    key: 'drivingLicenceNumberGbg',
    label: i18n['drivingLicenceNumberGbg.label'],
    type: 'AUSTRALIA_DRIVING_LICENCE',
    title: i18n['drivingLicenceNumberGbg.title']
  },
  AUSTRALIA_MEDICARE: {
    key: 'medicareNumberGbg',
    label: i18n['medicareNumberGbg.label'],
    type: 'AUSTRALIA_MEDICARE',
    title: i18n['medicareNumberGbg.title']
  },
  AUSTRALIA_PASSPORT: {
    key: 'shortPassportNumberGbg',
    label: i18n['shortPassportNumberGbg.label'],
    type: 'AUSTRALIA_PASSPORT',
    title: i18n['shortPassportNumberGbg.title']
  },
  CHINA_ID_CARD: {
    key: 'residentIdentityNumberGbg',
    label: i18n['residentIdentityNumberGbg.label'],
    type: 'CHINA_ID_CARD',
    title: i18n['residentIdentityNumberGbg.title']
  },
  INTERNATIONAL_PASSPORT: {
    key: 'passportMrzNumberFullGbg',
    label: i18n['passportMrzNumber.label'],
    type: 'INTERNATIONAL_PASSPORT',
    title: i18n['passportMrzNumber.title']
  }
};
const value_type_map = {
  1: 'AUSTRALIA_DRIVING_LICENCE',
  2: 'AUSTRALIA_PASSPORT',
  3: 'INTERNATIONAL_PASSPORT',
  4: 'AUSTRALIA_MEDICARE',
  5: 'CHINA_ID_CARD'
};
export const showFieldMap = {
  drivingLicenceNumberGbg: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'drivingLicenceNumberGbg',
    'drivingLicenceStateGbg'
  ], //驾照
  shortPassportNumberGbg: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'shortPassportNumberGbg',
    'passportCountryGbg'
  ], //澳洲护照
  passportMrzNumberFullGbg: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'passportMrzNumberFullGbg',
    'genderGbg',
    'countryOfOriginGbg',
    'passportDateOfExpiryGbg'
  ], //国际护照
  medicareNumberGbg: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'drivingLicenceNumberGbg',
    'drivingLicenceStateGbg',
    'medicareNumberGbg',
    'medicareReferenceNumberGbg',
    'dateOfExpiryGbg',
    'cardColourGbg'
  ], //医保卡
  residentIdentityNumberGbg: [
    'residentIdentityNumberGbg',
    'foreNameGbg',
    'surNameZhGbg',
    'countryGbg'
  ] //中国验证
};
export const TYPE_KEY_MAP = {
  ID_CARD: 'idNum',
  BANK_CARD: 'accountNo',
  AUSTRALIA_DRIVING_LICENCE: 'drivingLicenceNumberGbg',
  AUSTRALIA_MEDICARE: 'medicareNumberGbg',
  AUSTRALIA_PASSPORT: 'shortPassportNumberGbg',
  CHINA_ID_CARD: 'residentIdentityNumberGbg',
  INTERNATIONAL_PASSPORT: 'passportMrzNumberFullGbg'
};

export const KEY_TYPE_MAP = {
  idNum: 'ID_CARD',
  accountNo: 'BANK_CARD',
  drivingLicenceNumberGbg: 'AUSTRALIA_DRIVING_LICENCE',
  medicareNumberGbg: 'AUSTRALIA_MEDICARE',
  shortPassportNumberGbg: 'AUSTRALIA_PASSPORT',
  residentIdentityNumberGbg: 'CHINA_ID_CARD',
  ['passportMrzNumberFullGbg']: 'INTERNATIONAL_PASSPORT'
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
