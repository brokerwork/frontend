import { COUNTRY_KEY, COUNTRY_VERSION_KEY } from './country';
const LANGUAGE_KEY = 'LANGUAGE_DATA';
const LANGUAGE_VERSION_KEY = 'LANGUAGE_DATA_VERSION';
const LANGUAGE_TYPE_KEY = 'LANGUAGE_DATA_TYPE';

export const languages = [
  'zh-CN',
  'en-US',
  'zh-TW',
  'ja-JP',
  'ko-KR',
  'vi-VN',
  'th-TH',
  'id-ID',
  'ar-AE',
  'fil-PH'
];

export const get = function() {
  const __d = window.localStorage.getItem(LANGUAGE_KEY);
  return JSON.parse(__d);
};
export const set = function(v) {
  const __obj = {};
  v.forEach(item => {
    __obj[item.code] = item.value;
  });
  const __d = JSON.stringify(__obj);
  window.localStorage.setItem(LANGUAGE_KEY, __d);
};
export const getVersion = function() {
  return window.localStorage.getItem(LANGUAGE_VERSION_KEY);
};
export const setVersion = function(v) {
  window.localStorage.setItem(LANGUAGE_VERSION_KEY, v);
};
export const getType = function(defaultLanguage) {
  let __TYPE__;
  if (!__TYPE__) {
    let lang = window.localStorage.getItem(LANGUAGE_TYPE_KEY);
    // if (!lang) {
    //   let l = window.navigator.language || window.navigator.browserLanguage;
    //   l = l.split('-');
    //   if (l[1]) l[1] = l[1].toUpperCase();
    //   lang = l.join('-');
    //   window.localStorage.setItem(LANGUAGE_TYPE_KEY, lang);
    // }
    const supportLang = languages.includes(lang);
    if (!supportLang) {
      if (!defaultLanguage) {
        console.error(
          `There is no default language type has been applied,fallback to language:[en-US] we supported at all.`
        );
        return (__TYPE__ = 'en-US');
      }
      lang = defaultLanguage;
      window.localStorage.setItem(LANGUAGE_TYPE_KEY, lang);
    }
    __TYPE__ = lang;
  }
  return __TYPE__;
};
export const setType = function(type) {
  window.localStorage.removeItem(LANGUAGE_KEY);
  window.localStorage.removeItem(LANGUAGE_VERSION_KEY);
  window.localStorage.removeItem(LANGUAGE_TYPE_KEY);
  window.localStorage.removeItem(COUNTRY_KEY);
  window.localStorage.removeItem('PHONE_COUNTRY_CODE');
  window.localStorage.removeItem(COUNTRY_VERSION_KEY);
  // __TYPE__ = type;
  window.localStorage.setItem(LANGUAGE_TYPE_KEY, type);
};

export default {
  languages,
  get,
  set,
  getVersion,
  setVersion,
  getType,
  setType
};
