export const COUNTRY_KEY = 'COUNTRY';

export const getCountry = () => {
  const country = window.localStorage.getItem(COUNTRY_KEY);
  return JSON.parse(country);
};

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

