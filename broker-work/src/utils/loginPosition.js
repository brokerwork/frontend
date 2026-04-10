const LOGIN_POSITION_KEY = 'LOGIN_POSITION';

export const setLoginPosition = v => {
  window.localStorage.setItem(LOGIN_POSITION_KEY, v);
  return v;
};

export const getLoginPosition = () => {
  return window.localStorage.getItem(LOGIN_POSITION_KEY) || 'CENTER';
};
