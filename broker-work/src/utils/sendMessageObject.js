const MESSAGE_OBJECTS_KEY = 'MESSAGE_OBJECTS';
import {
  setItem as setSessionStorageItem,
  removeItem as removeSessionStorageItem,
  getItem as getSessionStorageItem
} from 'utils/sessionStorageShare';

export const saveMessageObjects = function(v) {
  const userInfo = JSON.stringify(v);
  setSessionStorageItem({ [MESSAGE_OBJECTS_KEY]: userInfo });
};

export const getMessageObjects = function() {
  const MessageObjects = getSessionStorageItem(MESSAGE_OBJECTS_KEY);
  return JSON.parse(MessageObjects);
};

export const clearMessageObjects = function() {
  removeSessionStorageItem(MESSAGE_OBJECTS_KEY);
};
