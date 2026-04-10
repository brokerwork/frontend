const MESSAGE_OBJECTS_KEY = 'MESSAGE_OBJECTS';

export const saveMessageObjects = function(v) {
  const userInfo = JSON.stringify(v);
  window.sessionStorage.setItem(MESSAGE_OBJECTS_KEY, userInfo);
};

export const getMessageObjects = function() {
  const MessageObjects = window.sessionStorage.getItem(MESSAGE_OBJECTS_KEY);
  return JSON.parse(MessageObjects);
};

export const clearMessageObjects = function() {
  window.sessionStorage.removeItem(MESSAGE_OBJECTS_KEY);
};

