import { COUNTRY_KEY, COUNTRY_VERSION_KEY } from './country'
const LANGUAGE_KEY = 'LANGUAGE_DATA'
const LANGUAGE_VERSION_KEY = 'LANGUAGE_DATA_VERSION'
const LANGUAGE_TYPE_KEY = 'LANGUAGE_DATA_TYPE'

const CACHED_ERRORS = 'CACHEDERRORS' //兼容旧版缓存数据格式


let __TYPE__

export const languages = ['zh-CN', 'en-US', 'zh-TW', 'ja-JP']
export const languageCode = {
  'zh-CN': '86',
	'en-US': '1',
	'zh-TW': '886',
	'ja-JP': '81'
}

export const get = function() {
  const __d = JSON.parse(window.localStorage.getItem(LANGUAGE_KEY) || '{}')
  return __d
}
export const set = function(v) {
  let obj = {}
  v.forEach(el=>{
    obj[el.code] = el.value
  })
  window.localStorage.setItem(LANGUAGE_KEY, JSON.stringify(obj))
}
export const getLanguageVersion = function() {
  return window.localStorage.getItem(LANGUAGE_VERSION_KEY)
}
export const setLanguageVersion = function(v) {
  window.localStorage.setItem(LANGUAGE_VERSION_KEY, v)
}
export const getType = function() {
  if (!__TYPE__) {
    let lang = window.localStorage.getItem(LANGUAGE_TYPE_KEY)
    if (!lang) {
      let l = window.navigator.language || window.navigator.browserLanguage;
      l = l.split('-');
      if (l[1]) l[1] = l[1].toUpperCase();
      lang = l.join('-');
      window.localStorage.setItem(LANGUAGE_TYPE_KEY, lang);
    }
    const supportLang = languages.indexOf(lang) != -1;
    if (!supportLang) {
      lang = 'en-US';
      window.localStorage.setItem(LANGUAGE_TYPE_KEY, lang);
    }

    __TYPE__ = lang;
  }
  return __TYPE__;
};
export const setType = function(type) {
  window.localStorage.removeItem(LANGUAGE_KEY)
  window.localStorage.removeItem(LANGUAGE_VERSION_KEY)
  window.localStorage.removeItem(LANGUAGE_TYPE_KEY)
  window.localStorage.removeItem(COUNTRY_KEY)
  window.localStorage.removeItem('PHONE_COUNTRY_CODE')
  window.localStorage.removeItem(COUNTRY_VERSION_KEY)
  __TYPE__ = type
  window.localStorage.setItem(LANGUAGE_TYPE_KEY, type)
}

export function isLanguageExist() {
  return !!window.localStorage.getItem(LANGUAGE_KEY)
}

export function isErrorExist() {
  return !!window.localStorage.getItem(CACHED_ERRORS)
}


export default { languages, get, set, getLanguageVersion, setLanguageVersion, getType, setType, isLanguageExist, isErrorExist }