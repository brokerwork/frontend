import { CARD_LABEL_REGEXP } from './constants';
//type : 'idNum' 身份证 目前只有身份证， 后续可能有港澳通行证
export const getIdByIdType = (data, fields, type = 'idNum') => {
  const ID_TYPE_KEY = 'idType';
  const fieldsIdTypeItem =
    fields && fields.find && fields.find(item => item.key === ID_TYPE_KEY);
  const fieldsIdtypeOptions = fieldsIdTypeItem && fieldsIdTypeItem.optionList;
  const idTypeValue = data && data[ID_TYPE_KEY];
  const idTypeValueMatchedOption =
    fieldsIdtypeOptions &&
    fieldsIdtypeOptions.find(item => item.value === idTypeValue);
  const idTypeLabel =
    idTypeValueMatchedOption && idTypeValueMatchedOption.label;
  const matchType = CARD_LABEL_REGEXP[type];
  let isLabelMatched = false;
  if (idTypeLabel && matchType) {
    isLabelMatched = matchType.includes(idTypeLabel);
  }
  if (isLabelMatched) {
    return data.idNum;
  }
};

export const getDataOfOwner = (
  accountOwnerInfo = {},
  fields,
  keys = ['baseInfo', 'financialInfo', 'certificatesInfo'],
  fieldsKeys = ['t_account_profiles', 't_account_finacial', 't_account_id_info']
) => {
  const fieldsMap = fieldsKeys.reduce((obj, k, i) => {
    obj[keys[i]] = fields[k].reduce((o, i) => ({ ...o, [i.key]: i }), {});
    return obj;
  }, {}); //将fields整理成map避免嵌套循环

  const shownAccountOwnerInfo = keys.reduce((obj, key) => {
    fieldsKeys;
    obj[key] = {};
    for (let k in accountOwnerInfo[key]) {
      if (fieldsMap[key] && fieldsMap[key][k]) {
        //筛选值对应的field能否找到
        obj[key][k] = accountOwnerInfo[key][k];
      }
    }
    return obj;
  }, {});

  const {
    [keys[0]]: {
      accountName,
      drivingLicenceNumberGbg,
      medicareNumberGbg,
      shortPassportNumberGbg,
      residentIdentityNumberGbg,
      passportMrzNumberFullGbg,
      foreNameGbg,
      surNameGbg,
      firstNameGbg,
      surNameZhGbg,
      dobGbg,
      buildingGbg,
      streetGbg,
      cityGbg,
      stateGbg,
      postcodeGbg,
      drivingLicenceStateGbg,
      passportCountryGbg,
      genderGbg,
      countryOfOriginGbg,
      passportDateOfExpiryGbg,
      medicareReferenceNumberGbg,
      dateOfExpiryGbg,
      cardColourGbg,
      countryGbg
    } = {},
    [keys[1]]: { accountNo } = {},
    [keys[2]]: idInfo,
    [keys[2]]: { idNum } = {}
  } = shownAccountOwnerInfo;
  console.log('shownAccountOwnerInfo', shownAccountOwnerInfo);
  const idCardNum = getIdByIdType(idInfo, fields && fields[fieldsKeys[2]]);
  return {
    name: accountName,
    idNum: idCardNum,
    accountNo: accountNo,
    drivingLicenceNumberGbg,
    medicareNumberGbg,
    shortPassportNumberGbg,
    residentIdentityNumberGbg,
    passportMrzNumberFullGbg,
    foreNameGbg,
    surNameGbg,
    surNameZhGbg,
    firstNameGbg,
    dobGbg,
    buildingGbg,
    streetGbg,
    cityGbg,
    stateGbg,
    postcodeGbg,
    drivingLicenceStateGbg,
    passportCountryGbg,
    genderGbg,
    countryOfOriginGbg,
    passportDateOfExpiryGbg,
    medicareReferenceNumberGbg,
    dateOfExpiryGbg,
    cardColourGbg,
    countryGbg
  };
};

export const getResultOfOwner = (data = {}) => {
  const {
    certificatesInfo: { idNumCheckInfo } = {},
    financialInfo: { accountNoCheckInfo } = {}
  } = data;
  return {
    idNum: idNumCheckInfo,
    accountNo: accountNoCheckInfo
  };
};
