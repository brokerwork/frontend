export const COUNTRY_KEY = 'COUNTRY';
export const COUNTRY_WITHOUT_CITY_KEY = 'COUNTRY_WITHOUT_CITY_KEY';
export const COUNTRY_VERSION_KEY = 'COUNTRY_VERSION';

export const getCountry = onlyCountries => {
  if (onlyCountries) {
    const country = window.localStorage.getItem(COUNTRY_WITHOUT_CITY_KEY);
    //有本地的COUNTRY_WITHOUT_CITY_KEY用本地的
    if (country) return JSON.parse(country);
    //否则从localstorage拿出COUNTRY_KEY来筛选， 这里可能有旧的COUNTRY_KEY确没有下一次saveCountry就会保证本地有COUNTRY_WITHOUT_CITY_KEY。
    //需要特殊处理。 下一次saveCountry就会保证本地有COUNTRY_WITHOUT_CITY_KEY。
    else {
      const country = JSON.parse(window.localStorage.getItem(COUNTRY_KEY));
      const countryWithoutCity =
        country && country.filter(item => item.pid == 0);
      window.localStorage.setItem(
        COUNTRY_WITHOUT_CITY_KEY,
        JSON.stringify(countryWithoutCity)
      );
      return countryWithoutCity;
    }
  } else {
    const country = window.localStorage.getItem(COUNTRY_KEY);
    return JSON.parse(country);
  }
};

export const getCountryObject = onlyCountries => {
  const d = {};
  const countryArray = getCountry(onlyCountries) || [];
  countryArray.forEach(item => {
    d[item.value] = item.label;
  });
  return d;
};

export const saveCountry = v => {
  const country = JSON.stringify(v);
  window.localStorage.setItem(COUNTRY_KEY, country);
  const countryWithoutCity = JSON.stringify(v.filter(item => item.pid == 0));
  window.localStorage.setItem(COUNTRY_WITHOUT_CITY_KEY, countryWithoutCity);
};

export const getVersion = function() {
  return window.localStorage.getItem(COUNTRY_VERSION_KEY);
};

export const setVersion = function(v) {
  window.localStorage.setItem(COUNTRY_VERSION_KEY, v);
};
