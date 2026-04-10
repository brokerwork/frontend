import fetch from 'isomorphic-fetch';
import { getToken } from './userInfo';
import sendLogToLogstore from './logStore';
import { getType as getLanguageType } from './language';
import { AESEncrypt, AESDecrypt, RSADecrypt, RSAEncrypt } from './encryption';
import encryptUrl from './encryptUrl';
import * as sessionStorage from 'utils/sessionStorageShare';
// 是否是测试环境
const testEnv = process.env.NODE_ENV === 'test';
// 虚假域名，用于编写测试时，请求拦截，
const testDomain = testEnv ? 'http://domainfortest.lwork.com' : '';
// 请求域名
let host = '';
let originHost = window.location.host;
// 最后一次请求成功的时间
let lastResponseTime;
// 设置域名 后端会读取index.html的内容, 并且对 window._API_HOST_ 变量赋值,
// 如果没有赋值或者 window._API_HOST_ = '${apiUrl}' 为原始值的情况, 不修改host
// host会做为ajax请求的域名;
!(function() {
  const apiHost = window._API_HOST_;
  if (!apiHost || apiHost === '#{apiUrl}') return;
  host = apiHost;
})();
// 防重放攻击，最近一个请求发起时间
let preventionRecapAttackLastTime;
let preventionRecapAttackServerTime;

const pathConfigToReg = pathConfig => {
  return pathConfig.map(item => {
    const { path } = item;
    const pathTransform = path.replace('**', '.*');
    const reg = new RegExp(`(^${pathTransform}$)`, 'ig');
    return { ...item, reg };
  });
};

// 防重放攻击，ajax pramas t 的计算
const timeGenerator = (serverTime, lastReqTime) => {
  const now = Date.now();
  return Number(serverTime) + now - Number(lastReqTime);
};

// 配置需要加密的url以及对应的加密方式
const encryptUrlConfig = pathConfigToReg(encryptUrl);

// 获取当前协议头 是http或者https;
const getProtocol = () => {
  const rotocolStr = document.location.protocol;
  return rotocolStr && rotocolStr.substring(0, rotocolStr.length - 1);
};

function ajax(
  method = 'get',
  {
    url = '',
    data = {},
    header = {},
    aesEncrypt = false,
    aesDecrypt = false,
    rsaEncrypt = false,
    rsaDecrypt = false,
    isFormData = false
  }
) {
  let lang = getLanguageType();
  if (lang === 'ar-AE') {
    lang = 'ar-tn';
  }
  const _header = {
    'x-language': lang,
    'X-Api-Token': getToken(),
    Hostd: originHost,
    'Cache-Control': 'no-cache',
    schemed: getProtocol()
  };

  if (!isFormData) _header['Content-Type'] = 'application/json';

  const requestHeaders = Object.assign({}, _header, header);
  let matchEncryptConfig = null;
  for (let item of encryptUrlConfig) {
    if (matchEncryptConfig || !url.match(item.reg)) continue;
    matchEncryptConfig = item;
    break;
  }
  if (matchEncryptConfig) {
    aesEncrypt = matchEncryptConfig.aesEncrypt;
    aesDecrypt = matchEncryptConfig.aesDecrypt;
    rsaEncrypt = matchEncryptConfig.rsaEncrypt;
    rsaDecrypt = matchEncryptConfig.rsaDecrypt;
  }

  let body;
  let prefix = url.indexOf('?') !== -1 ? '&' : '?';
  let noCache = '';
  preventionRecapAttackServerTime = sessionStorage.getItem(
    'preventionRecapAttackServerTime'
  );
  preventionRecapAttackLastTime = sessionStorage.getItem(
    'preventionRecapAttackLastTime'
  );
  if (preventionRecapAttackServerTime && preventionRecapAttackLastTime) {
    const t = timeGenerator(
      preventionRecapAttackServerTime,
      preventionRecapAttackLastTime
    );
    noCache = `t=${t}`;
  } else {
    noCache = `t=${Date.now()}`;
  }
  if (['get'].indexOf(method) !== -1) {
    let params = [];
    for (let k in data) {
      if (typeof data[k] === 'undefined') continue;
      params.push(`${k}=${data[k]}`);
    }
    params.push(noCache);
    url += `${prefix}${params.join('&')}`;
  } else {
    url += `${prefix}${noCache}`;

    if (isFormData) {
      // data需要为FormData对象
      data.append('t', noCache);

      body = data;
    } else {
      body = JSON.stringify(data);
    }
    // 是否需要aes加密
    if (aesEncrypt) {
      body = AESEncrypt(data);
    } else if (rsaEncrypt) {
      body = RSAEncrypt(data);
    }
  }
  const requestPrefix = url.match(/^http|^\/\//gi) // url.includes(LANGUAGE_CDN_URL)
    ? ''
    : `${testEnv ? testDomain : host}/api`;
  console.log('data', body);

  return fetch(`${requestPrefix}${url}`, {
    body,
    method,
    headers: requestHeaders,
    // Sending cookies
    credentials: 'same-origin'
  })
    .then(res => {
      if (res.status >= 200 && res.status < 400) {
        return res;
      } else {
        // api 链接失败
        // return Promise.reject(res.statusText);
        sendLogToLogstore({
          url,
          body: data,
          requestHeaders,
          resultData: {
            result: false,
            mcode: 'apiResonseError',
            errorMsg: res.statusText
          }
        });
        throw new Error(res.statusText);
      }
    })
    .then(res => {
      if (aesDecrypt || rsaDecrypt) return res.text();
      return res.json();
    })
    .then(responseData => {
      let resultData = responseData;
      // 是否需要解密
      if (aesDecrypt) {
        resultData = AESDecrypt(responseData);
      } else if (rsaDecrypt) {
        resultData = RSADecrypt(responseData);
      }
      if (!__PROD__) {
        // 开发和测试环境用于对加密的数据进行调试
        // 生成环境时，压缩工具会删除这段代码。
        if (window.___SHOW_DECRYPT_DATA__ && (aesDecrypt || rsaDecrypt)) {
          console.log('DECRYPT URL: ', url);
          console.log('DECRYPT REQUEST DATA: ', data);
          console.log('DECRYPT RESPONSE DATA: ', resultData);
          console.log('=====================DECRYPT_DATA===================');
        }
      }
      if (resultData.time) {
        preventionRecapAttackServerTime = resultData.time;
        preventionRecapAttackLastTime = Date.now();
        sessionStorage.setItem({
          ['preventionRecapAttackServerTime']: preventionRecapAttackServerTime,
          ['preventionRecapAttackLastTime']: preventionRecapAttackLastTime
        });
      }
      sendLogToLogstore({ url, body: data, requestHeaders, resultData });
      if (getToken()) {
        lastResponseTime = Date.now();
      } else {
        lastResponseTime = undefined;
      }
      // 不直接抛出错误，通过error middleware 处理错误
      return resultData;
    })
    .catch(err => {
      return Promise.resolve(err);
    });
}

export const [get, post, put, dele] = ['get', 'post', 'put', 'delete'].map(
  method => {
    return function({
      url,
      data,
      header,
      aesEncrypt,
      aesDecrypt,
      rsaEncrypt,
      rsaDecrypt,
      isFormData
    }) {
      return ajax(method, {
        url,
        data,
        header,
        aesEncrypt,
        aesDecrypt,
        rsaEncrypt,
        rsaDecrypt,
        isFormData
      });
    };
  }
);

// 示例1：不传入第二个参数
// all([
//  get({url: '/v1/fabc1'}),
//  get({url: '/v1/fabc2'}),
//  post({url: '/v1/fabc3'}),
//  post({url: '/v1/fabc4'}),
// ]).then((res) => {
//    console.log(res);
//    // res是一个数组，元素依次为传入的ajax的返回值
// });
//
// 示例2：传入第二个参数
// all([
//  get({url: '/v1/fabc1'}),
//  get({url: '/v1/fabc2'}),
//  post({url: '/v1/fabc3'}),
//  post({url: '/v1/fabc4'}),
// ], ['fabc1', 'fabc2', 'fabc3', 'fabc4']).then((res) => {
//    console.log(res);
//    // res是一个Ojbect
//    // key为fabc1....fabc4
//    // value为 第一个参数中第一到4个ajax的返回值
// });
export const all = (promiseArray, keyArray, resolveWhenFaild) => {
  return Promise.all(promiseArray).then(res => {
    let __res = [];
    let apiFaild = false;
    for (let item of res) {
      if (item.result || resolveWhenFaild) {
        __res.push(item.data);
        continue;
      }
      if (!apiFaild) apiFaild = item.mcode;
    }
    if (keyArray && Array.isArray(keyArray)) {
      const __data = {};
      keyArray.forEach((item, index) => {
        __data[item] = __res[index];
      });
      __res = __data;
    }
    if (apiFaild && !resolveWhenFaild) {
      // 不直接抛出错误，通过error middleware 处理错误
      return Promise.resolve({
        result: false,
        mcode: apiFaild,
        data: __res
      });
    }
    return Promise.resolve({
      data: __res,
      result: true,
      mcode: 'm0000000'
    });
  });
};

export const getLastResponseTime = () => {
  return lastResponseTime;
};
