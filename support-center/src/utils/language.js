const LANGUAGE_KEY = 'LANGUAGE_DATA';
const LANGUAGE_LANG_KEY = 'LANGUAGE_DATA_TYPE';
const LANGUAGE_VERSION_KEY = 'LANGUAGE_DATA_VERSION';
const language = {
  langs: ['zh-CN', 'en-US', 'zh-TW', 'ja-JP', 'ko-KR', 'vi-VN', 'ar-AE', 'fil-PH'],
  getVersion: () => {
    return window.localStorage.getItem(LANGUAGE_VERSION_KEY);
  },
  setVersion: version => {
    window.localStorage.setItem(LANGUAGE_VERSION_KEY, version);
  },
  setData: data => {
    const _data = JSON.stringify(data);

    window.localStorage.setItem(LANGUAGE_KEY, _data);
    //
    window.localStorage.setItem('i18n', _data);
  },
  getData: () => {
    const data = window.localStorage.getItem(LANGUAGE_KEY);

    return JSON.parse(data);
  },
  setLang: lang => {
    window.localStorage.setItem(LANGUAGE_LANG_KEY, lang);
    //
    window.localStorage.setItem('language', lang);
  },
  getLang: () => {
    let lang = window.localStorage.getItem(LANGUAGE_LANG_KEY);

    if (!lang) {
      let localLang = window.navigator.language || window.navigator.browserLanguage;

      localLang = localLang.split('-');

      if (localLang[1]) {
        localLang[1] = localLang[1].toUpperCase();
      }

      lang = localLang.join('-');

      window.localStorage.setItem(LANGUAGE_LANG_KEY, lang);
      //
      window.localStorage.setItem('language', lang);
    }

    const isSupported = language.langs.includes(lang);

    if (!isSupported) {
      lang = 'en-US';
      window.localStorage.setItem(LANGUAGE_LANG_KEY, lang);
      //
      window.localStorage.setItem('language', lang);
    }

    return lang;
  }
};

export default language;
