const USER_INFO_KEY = 'USER_RIGHT';
import {
  setItem as setSessionStorageItem,
  getItem as getSessionStorageItem
} from 'utils/sessionStorageShare';

export const saveUserRight = function(value) {
  let userRight = {};
  value.forEach(item => {
    userRight[item] = true;
  });
  const userRightString = JSON.stringify(userRight);
  setSessionStorageItem({ [USER_INFO_KEY]: userRightString });
  return userRight;
};

export const getUserRight = function() {
  let userRight = {};
  if (Object.keys(userRight).length !== 0) return userRight;
  const userRightFromCahce = JSON.parse(getSessionStorageItem(USER_INFO_KEY));
  if (userRightFromCahce) {
    userRight = userRightFromCahce;
  }
  return userRightFromCahce;
};
