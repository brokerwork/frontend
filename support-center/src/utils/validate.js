const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const numberRegex = /^\d+(?:\.\d{1,2})?$/;
const positiveRegex = /^[1-9]+$/;
export const lettersRegex = /^([a-z]|\s)+$/i;

// 必填
export const isRequired = value => !!value;
// 邮箱
export const isEmail = value => emailRegex.test(value);
// 数字
export const isNumber = value => !isNaN(parseFloat(value)) && isFinite(value);
// 手机号
export const isPhone = value => /^[0-9\-\s]{5,20}$/.test(value);
// 金额
export const isMoney = value => /^\d+(\.\d{1,2})?$/gi.test(value);
// 两位小数点小数
export const isPositiveNumber = value => numberRegex.test(value);
// 正整数
export const isNoDotNumber = value => positiveRegex.test(value);
//字母
export const isLetters = value => lettersRegex.test(value);
