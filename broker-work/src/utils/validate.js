const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const numberRegex = /^\d+(?:\.\d{1,3})?$/;
const positiveRegex = /^[1-9]+[0-9]*$/;
const PUNCT = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
export const toJsRegExpMap = data => {
  let map = {};
  for (let key in data) {
    let backendRegExp = data[key];
    map[key] = new RegExp(
      backendRegExp
        .replace(/\\p{Digit}/g, '\\d')
        .replace(/\\p{Lower}/g, 'a-z')
        .replace(/\\p{Upper}/g, 'A-Z')
        .replace(/\\p{Alpha}/g, 'a-zA-Z')
        .replace(/\\p{Punct}/g, PUNCT)
    );
  }
  return map;
};
// 必填
export const isRequired = value =>
  value !== undefined && value !== null && value !== '';
// 邮箱
export const isEmail = value => emailRegex.test(value);
// 数字
export const isNumber = value => !isNaN(parseFloat(value)) && isFinite(value);
// 手机号
export const isPhone = value => /^[0-9\-\s]{5,20}$/.test(value);
// 手机号必填
export const isPhoneRequired = value =>
  typeof value === 'object' && isRequired(value.phone);
// 金额
export const isMoney = value => /^\d+(\.\d{1,2})?$/gi.test(value);
// 三位小数点小数
export const isPositiveNumber = value => numberRegex.test(value);
// 正整数
export const isNoDotNumber = value => positiveRegex.test(value);
// 国家
export const isCountry = value =>
  typeof value === 'object' && value.city && value.country && value.province;
export const isTinRequired = value =>
  typeof value === 'object' && value.countryCode && value.tin;
