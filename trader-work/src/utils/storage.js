export const TOKEN = "TOKEN";
export const USER_INFO = "USER_INFO";
export const BRAND_INFO = "BRAND_INFO";
export const ACCOUNT_DATA = "ACCOUNT_DATA_1";
export const ACCOUNT_TOKEN = "ACCOUNT_TOKEN_1"; //需要发版本清空以前ACCOUNT_TOKEN全部缓存，故改一下key
export const LOGIN_CHECKED = "LOGIN_CHECKED";
export const LAST_USER_LOGIN_TIME = "LAST_USER_LOGIN_TIME";
export const REMEMBER_USER_INFO = "REMEMBER_USER_INFO";
export const LOGIN_DEFAULT_TYPE = "LOGIN_DEFAULT_TYPE";
export const DEFAULT_LANGUAGE_TYPE = "DEFAULT_LANGUAGE_TYPE";
//当前登录的账户信息

const ls = {
  setItem(key, val) {
    let strVal = val;
    if (typeof val == "object") {
      strVal = JSON.stringify(val);
    }
    window.localStorage.setItem(key, strVal);
  },
  getItem(key) {
    let val = window.localStorage.getItem(key);
    try {
      return JSON.parse(val);
    } catch (error) {
      return val;
    }
  },
  removeItem(key) {
    window.localStorage.removeItem(key);
  }
};

const ss = {
  setItem(key, val) {
    let strVal = val;
    if (typeof val == "object") {
      strVal = JSON.stringify(val);
    }
    window.sessionStorage.setItem(key, strVal);
  },
  getItem(key) {
    let val = window.sessionStorage.getItem(key);
    try {
      return JSON.parse(val);
    } catch (error) {
      return val;
    }
  }
};

export { ls, ss };
