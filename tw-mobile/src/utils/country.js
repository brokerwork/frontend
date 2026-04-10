export const COUNTRY_KEY = 'CACHEDCOUNTRIES';
export const COUNTRY_VERSION_KEY = 'COUNTRY_VERSION';
export const COUNTRY_CODE_KEY = 'COUNTRY_CODE'
export const NATION_KEY ='NATION_KEY'

export const getCountryObject = () => {
  const d = {};
  const countryArray = getCountry() || [];
  countryArray.forEach((item) => {
    d[item.value] = item.label;
  });
  return d;
};

export const saveCountry = (v) => {
  const country = JSON.stringify(v);
  window.localStorage.setItem(COUNTRY_KEY, country);
};

export const getCountry = () => {
  const country = window.localStorage.getItem(COUNTRY_KEY);
  return JSON.parse(country);
};

export const setVersion = function (v) {
  window.localStorage.setItem(COUNTRY_VERSION_KEY, v);
};

export const getVersion = function () {
  return window.localStorage.getItem(COUNTRY_VERSION_KEY);
};

export const saveCountryCode = (v) => {
  window.localStorage.setItem(COUNTRY_CODE_KEY, JSON.stringify(v))
}

export const getCountryCode = () => {
  const country = window.localStorage.getItem(COUNTRY_CODE_KEY)
  return JSON.parse(country)
}

export const saveNation = (v) => { 
  const nation = JSON.stringify(v);
  window.localStorage.setItem(NATION_KEY, nation);
}

export const getNation = () => { 
  const nation = window.localStorage.getItem(NATION_KEY)
  return JSON.parse(nation)
}

//  是否缓存国家代码数据
export function isCountryCodeExist() {
  return !!window.localStorage.getItem(COUNTRY_CODE_KEY)
}

export function isCountryExist() {
  return !!window.localStorage.getItem(COUNTRY_KEY)
}