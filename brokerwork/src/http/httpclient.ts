import {UserHelper} from '../common/userHelper';
import {I18nLoader} from '../i18n/loader';
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
 
function parseJSON(response) {
  return response.json()
}

function getTokenHeader():any {
  return {
    'X-Api-Token': UserHelper.getToken()
  }
}

function dataProcess(req) {
  if (req.result) {
    return Promise.resolve(req.data);
  }
  return Promise.reject(req.mcode);
}

function getDefaultHeaders():any {
  return {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'x-language': I18nLoader.getLang(),
    'X-Api-Token': UserHelper.getToken()
  }
}

function ajax (method:string, url:string, parmJson?:{[name:string]:any}, extraHeaders?:{[name:string]:any}) {
    const requestHeaders = Object.assign({}, getDefaultHeaders(), extraHeaders);
    let body:string;
    if (['get', 'delete'].indexOf(method) !== -1) {
      let params:string[] = [];
      for (let k in parmJson) {
        params.push(`${k}=${parmJson[k]}`);
      }
      let prefix = url.indexOf('?') !== -1 ? '&' : '?';
      prefix = params.length > 0 ? prefix : '';
      url += `${prefix}${params.join('&')}`;
    } else {
      body = JSON.stringify(parmJson);
    }
    return fetch(url, {
      body,
      method: method,
      headers: requestHeaders,
      credentials: 'same-origin' // Sending cookies
    }).then(checkStatus).then(parseJSON);
}

let HttpClient = {
  doGet( url:string, paramJson?:{[name:string]:any}, extraHeaders?:{[name:string]:any} ) {
    return ajax('get', url, paramJson, extraHeaders);
  },
  doPost( url:string, paramJson?:{[name:string]:any}, extraHeaders?:{[name:string]:any}) {
    return ajax('post', url, paramJson, extraHeaders);
  },
  get( url:string, paramJson?:{[name:string]:any}, extraHeaders?:{[name:string]:any} ) {
    return ajax('get', url, paramJson, extraHeaders).then(dataProcess);
  },
  post( url:string, paramJson?:{[name:string]:any}, extraHeaders?:{[name:string]:any}) {
    return ajax('post', url, paramJson, extraHeaders).then(dataProcess);
  }
}

export { HttpClient };
