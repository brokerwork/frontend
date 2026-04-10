const COUNTRY_CODE_KEY = 'PHONE_COUNTRY_CODE';

export const getCountryCode = () => {
  const countryCode = window.localStorage.getItem(COUNTRY_CODE_KEY);
  return JSON.parse(countryCode);
}

export const saveCountryCode = (v) => {
  const countryCode = JSON.stringify(v);
  window.localStorage.setItem(COUNTRY_CODE_KEY, countryCode);
}

