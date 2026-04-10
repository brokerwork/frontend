const USER_INFO_KEY = 'USER_RIGHT';

export const saveUserRight = function(value) {
  const v = {};
  value.forEach((item) => {
    v[item] = true;
  });
  const userRight = JSON.stringify(v);
  window.sessionStorage.setItem(USER_INFO_KEY, userRight);
  return v;
}

export const getUserRight = function() {
    const userRight = window.sessionStorage.getItem(USER_INFO_KEY);
    return JSON.parse(userRight);
}

