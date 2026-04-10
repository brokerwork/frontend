import cookie from 'js-cookie';
const USER_INFO_KEY = 'USER_INFO';
const TOKEN_KEY = 'TOKEN';
import {
  setItem as setSessionStorageItem,
  removeItem as removeSessionStorageItem,
  getItem as getSessionStorageItem
} from 'utils/sessionStorageShare';

export const saveUserInfo = function(v) {
  const userInfo = JSON.stringify(v);
  setSessionStorageItem({ [USER_INFO_KEY]: userInfo });
};

export const getUserInfo = function() {
  const userInfo = getSessionStorageItem(USER_INFO_KEY);
  return JSON.parse(userInfo);
};

export const clearUserInfo = function() {
  removeSessionStorageItem(USER_INFO_KEY);
};

export const getToken = function() {
  // return getSessionStorageItem(TOKEN_KEY);
  return cookie.get(TOKEN_KEY);
};

export const saveToken = function(v) {
  cookie.set(TOKEN_KEY, v);
  // setSessionStorageItem({ [TOKEN_KEY]: v });
};

export const removeToken = function() {
  // removeSessionStorageItem(TOKEN_KEY);
  cookie.remove(TOKEN_KEY);
};
