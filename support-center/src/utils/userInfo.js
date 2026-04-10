import cookie from 'js-cookie';
const USER_INFO_KEY = 'USER';
const TOKEN_KEY = 'TOKEN';

export const saveUserInfo = function(v) {
  const userInfo = JSON.stringify(v);
  window.sessionStorage.setItem(USER_INFO_KEY, userInfo);
  // 
  window.localStorage.setItem(USER_INFO_KEY, userInfo);
};

export const getUserInfo = function() {
  const userInfo = window.sessionStorage.getItem(USER_INFO_KEY);
  return JSON.parse(userInfo);
};

export const clearUserInfo = function() {
  window.sessionStorage.removeItem(USER_INFO_KEY);
};

export const getToken = function() {
  const s =  window.sessionStorage.getItem(TOKEN_KEY);
  if (s) return s;
  const c = cookie.get(TOKEN_KEY);
  if (c) window.sessionStorage.setItem(TOKEN_KEY, c);
  return c;
};

export const saveToken = function(v) {
  cookie.set(TOKEN_KEY, v);
  window.sessionStorage.setItem(TOKEN_KEY, v);
};

export const removeToken = function() {
  window.sessionStorage.removeItem(TOKEN_KEY);
  cookie.remove(TOKEN_KEY);
};