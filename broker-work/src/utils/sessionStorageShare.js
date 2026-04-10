const LOGOUT_EVENT = 'LOGOUT_EVENT_SESSION';
const UPDATE_EVENT = 'UPDATE_EVENT_SESSION';
const SET_SESSION = 'SET_SESSION_STORAGE';
const GET_SESSION = 'GET_SESSION_STORAGE';
const REMOVE_SESSION = 'REMOVE_SESSION_STORAGE';

let sessionStorageObj = {};

// ====================================
// 登出时调用，用于删除登陆信息
export const logoutSessionStorage = () => {
  localStorage.setItem(LOGOUT_EVENT, LOGOUT_EVENT);
  localStorage.removeItem(LOGOUT_EVENT);
  sessionStorageObj = {};
  sessionStorage.clear();
};

export const updateSessionStorage = () => {
  localStorage.setItem(UPDATE_EVENT, UPDATE_EVENT);
  localStorage.removeItem(UPDATE_EVENT);
  sessionStorageObj = {};
  sessionStorage.clear();
};

// 登陆时调用，用于同步登陆信息
export const shareSessionStorage = data => {
  setTimeout(() => {
    localStorage.setItem(SET_SESSION, JSON.stringify(data));
    localStorage.removeItem(SET_SESSION);
  }, 1);
};

const updateItem = data => {
  const keys = Object.keys(data);
  keys.forEach(key => {
    sessionStorageObj[key] = data[key];
    window.sessionStorage.setItem(key, data[key]);
  });
};

export const setItem = data => {
  updateItem(data);
  shareSessionStorage(data);
};

export const removeItem = key => {
  delete sessionStorageObj[key];
  window.sessionStorage.removeItem(key);
  localStorage.setItem(REMOVE_SESSION, key);
  localStorage.removeItem(REMOVE_SESSION);
};

export const getItem = key => {
  if (sessionStorageObj[key]) return sessionStorageObj[key];
  const v = window.sessionStorage.getItem(key);
  if (v) return v;
  return null;
};

export const gotoLoginPage = () => {
  window.sessionStorage.clear();
  // 清除其他浏览器标签页的sessionStorage
  logoutSessionStorage();

  window.location.href = '/';
};

// 子页面从父页面中拉取sessionStorage中的信息
// ====================================
// transfers sessionStorage from one tab to another
const sessionStorageTransfer = event => {
  let e = event;
  if (!e) e = window.event; // ie suq
  if (!e.newValue) return; // do nothing if no value to work with
  if (e.key === GET_SESSION) {
    if (sessionStorage.length === 0) return;
    // another tab asked for the sessionStorage -> send it
    localStorage.setItem(SET_SESSION, JSON.stringify(sessionStorage));
    // the other tab should now have it, so we're done with it.
    setTimeout(() => {
      localStorage.removeItem(SET_SESSION);
    }, 1);
    // 同步设置值
  } else if (e.key === SET_SESSION) {
    const data = JSON.parse(e.newValue);
    updateItem(data);
    // 同步删除key
  } else if (e.key === REMOVE_SESSION) {
    windows.sessionStorage.removeItem(REMOVE_SESSION);
    // 退出登陆状态
  } else if (e.key === LOGOUT_EVENT) {
    sessionStorageObj = {};
    sessionStorage.clear();
    setTimeout(() => {
      window.location.href = '/';
    }, 1);
  } else if (e.key === UPDATE_EVENT) {
    sessionStorageObj = {};
    sessionStorage.clear();
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  }
};

// listen for changes to localStorage
if (window.addEventListener) {
  window.addEventListener('storage', sessionStorageTransfer, false);
} else {
  window.attachEvent('onstorage', sessionStorageTransfer);
}

// 新开tab页时 用于同步登录信息
if (!sessionStorage.length) {
  localStorage.setItem(GET_SESSION, GET_SESSION);
  localStorage.removeItem(GET_SESSION);
}
