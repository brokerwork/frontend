import fetch from "isomorphic-fetch";
import { getToken } from "./userInfo";
import { getTenantId } from "./tenantInfo";
import language from "./language";

function ajax(method = "get", url = "", data = {}, header = {}) {
  const requestHeaders = Object.assign(
    {},
    {
      "Content-Type": "application/json",
      "x-language": language.getLang(),
      "x-Api-Token": getToken(),
      "x-Tenant-ID": getTenantId(),
      "Cache-Control": "no-cache"
    },
    header
  );
  let body;
  let prefix = url.indexOf("?") !== -1 ? "&" : "?";
  const noCache = `t=${Date.now()}`;
  if (["get"].indexOf(method) !== -1) {
    let params = [];
    for (let k in data) {
      params.push(`${k}=${data[k]}`);
    }
    params.push(noCache);
    // prefix = params.length > 0 ? prefix : '';
    url += `${prefix}${params.join("&")}`;
  } else {
    url += `${prefix}${noCache}`;
    body = JSON.stringify(data);
  }

  return fetch(url, {
    body,
    method,
    headers: requestHeaders,
    // Sending cookies
    credentials: "same-origin"
  })
    .then(res => {
      if (res.status >= 200 && res.status < 400) {
        return res;
      } else {
        // api 链接失败
        // return Promise.reject(res.statusText);
        throw new Error(res.statusText);
      }
    })
    .then(res => {
      // 不直接抛出错误，通过error middleware 处理错误
      return res.json();
    });
}

export const [get, post, put, fetchDelete] = [
  "get",
  "post",
  "put",
  "delete"
].map(item => {
  return function({ url, data, header, handle }) {
    return ajax(item, url, data, header);
  };
});

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
export const all = (promiseArray, keyArray) => {
  return Promise.all(promiseArray).then(res => {
    let __res = [];
    let apiFaild = false;
    for (let item of res) {
      if (item.result) {
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
    if (apiFaild) {
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
      mcode: "m0000000"
    });
  });
};
