import language from './language';
import {
  setItem as setSessionStorageItem,
  getItem as getSessionStorageItem
} from 'utils/sessionStorageShare';

const KEY = 'filterToken';
export const get = () => {
  const dataStr = getSessionStorageItem(KEY);
  const lang = language.getType();
  const result = dataStr && JSON.parse(dataStr);
  return (result && result[lang]) || {};
};

export const set = (...keys) => {
  return (props, type) => {
    const currentData = get(props);
    const lang = language.getType();
    let _query = Object.assign({}, currentData);
    keys.forEach(key => {
      let value = props[key];
      Object.assign(_query, { [`${type}${key}`]: value });
    });
    for (let i in _query) {
      if (
        typeof _query[i] === 'undefined' ||
        (typeof _query[i] === 'string' && _query[i].trim() === '')
      ) {
        delete _query[i];
      }
    }
    setSessionStorageItem({ [KEY]: JSON.stringify({ [lang]: _query }) });
  };
};
