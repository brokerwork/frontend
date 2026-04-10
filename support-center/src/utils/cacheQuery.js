import language from './language';
const KEY = 'filterToken';
export const get = ({ location: {query} }) => {
  const dataStr = window.sessionStorage.getItem(`${KEY}${query.filter}`);
  const lang = language.getType();
  const result = dataStr && JSON.parse(dataStr);
  return result && result[lang] || {};
};

export const set = (...keys) => (props) => {
  const { router: { replace }, location: { query, pathname } } = props;
  const currentFilter = query.filter;
  const filter = currentFilter || window.btoa(new Date().getTime());
  const currentData =  get(props);
  const lang = language.getType();
  let _query = Object.assign({}, currentData);
  keys.forEach(key => {
    let value = props[key];
    Object.assign(_query, { [key]: value });
  });
  for (let i in _query) {
    if ( typeof _query[i] === 'undefined'|| typeof _query[i] === 'string' && _query[i].trim() === '') {
      delete _query[i];
    }
  }
  
  window.sessionStorage.setItem(`${KEY}${filter}`, JSON.stringify({[lang]: _query}));
  if(!currentFilter){
     replace({pathname: pathname, query: { filter } });
  }
 
};

