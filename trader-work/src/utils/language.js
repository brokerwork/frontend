import { COUNTRY_KEY, COUNTRY_VERSION_KEY } from "./country";
const LANGUAGE_KEY = "LANGUAGE_DATA";
const LANGUAGE_VERSION_KEY = "LANGUAGE_DATA_VERSION";
const LANGUAGE_TYPE_KEY = "LANGUAGE_DATA_TYPE";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import en_US from "antd/lib/locale-provider/en_US";
import zh_TW from "antd/lib/locale-provider/zh_TW";
import ja_JP from "antd/lib/locale-provider/ja_JP";
import ko_KR from "antd/lib/locale-provider/ko_KR";
import vi_VN from "antd/lib/locale-provider/vi_VN";
const CACHED_ERRORS = "CACHEDERRORS"; //兼容旧版缓存数据格式

// let __TYPE__;

export const languages = [
  "zh-CN",
  "en-US",
  "zh-TW",
  "ja-JP",
  "ko-KR",
  "vi-VN",
  "th-TH",
  "id-ID"
];
export const languagesCountryCode = ["+86", "+1 ", "+886", "+81", "+82"];

export const get = function() {
  const __d = JSON.parse(window.localStorage.getItem(LANGUAGE_KEY) || "{}");
  return __d;
};
export const set = function(v) {
  let obj = {};
  v.forEach(el => {
    obj[el.code] = el.value;
  });
  window.localStorage.setItem(LANGUAGE_KEY, JSON.stringify(obj));
};
export const getLanguageVersion = function() {
  return window.localStorage.getItem(LANGUAGE_VERSION_KEY);
};
export const setLanguageVersion = function(v) {
  window.localStorage.setItem(LANGUAGE_VERSION_KEY, v);
};
export const getType = function(defaultLanguage) {
  let __TYPE__ = "";
  if (!__TYPE__) {
    let lang = window.localStorage.getItem(LANGUAGE_TYPE_KEY);
    // if (!lang) {
    // 	let l = window.navigator.language || window.navigator.browserLanguage;
    // 	l = l.split("-");
    // 	if (l[1]) l[1] = l[1].toUpperCase();
    // 	lang = l.join("-");
    // 	window.localStorage.setItem(LANGUAGE_TYPE_KEY, lang);
    // }
    const supportLang = languages.includes(lang);
    if (!supportLang) {
      if (!defaultLanguage) {
        console.error(
          `There is no default language type has been applied,fallback to language:[en-US] we supported at all.`
        );
        return (__TYPE__ = "en-US");
      }
      lang = defaultLanguage;
      console.log(";f", lang);
      window.localStorage.setItem(LANGUAGE_TYPE_KEY, lang);
    }
    __TYPE__ = lang;
  }
  return __TYPE__;
};
export const getProviderType = () => {
  let type = "";
  switch (getType()) {
    case "zh-CN":
      type = zh_CN;
      break;
    case "zh-TW":
      type = zh_TW;
      break;
    case "en-US":
      type = en_US;
      break;
    case "ja-JP":
      type = ja_JP;
      break;
    case "ko-KR":
      type = ko_KR;
      break;
    case "vi-VN":
      type = vi_VN;
      break;
    default:
      "";
  }
  return type;
};
export const getTypeCountryCode = () => {
  return languagesCountryCode[languages.indexOf(getType())];
};
export const setType = function(type) {
  window.localStorage.removeItem(LANGUAGE_KEY);
  window.localStorage.removeItem(LANGUAGE_VERSION_KEY);
  window.localStorage.removeItem(LANGUAGE_TYPE_KEY);
  window.localStorage.removeItem(COUNTRY_KEY);
  window.localStorage.removeItem("PHONE_COUNTRY_CODE");
  window.localStorage.removeItem(COUNTRY_VERSION_KEY);
  // __TYPE__ = type;
  window.localStorage.setItem(LANGUAGE_TYPE_KEY, type);
};

export function isLanguageExist() {
  return !!window.localStorage.getItem(LANGUAGE_KEY);
}

export function isErrorExist() {
  return !!window.localStorage.getItem(CACHED_ERRORS);
}

// export default { languages, get, set, getVersion, setVersion, getType, setType, isLanguageExist, isErrorExist, setError }
