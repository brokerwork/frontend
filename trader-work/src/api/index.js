import axios from "axios";
import * as language from "@/utils/language";
import { TOKEN, ACCOUNT_TOKEN } from "@/utils/storage";
import {
  AESEncrypt,
  AESDecrypt,
  RSAEncrypt,
  RSADecrypt
} from "@/utils/encryption";
import utils from "@/utils/common";
const methods = ["get", "head", "post", "put", "delete", "options", "patch"];
const paramsMethods = ["get", "delete"];
let rsaUrls = [],
  aesUrls = [];
rsaUrls = [
  // "/v2/user/register/phone",
  //   "/v2/user/loginWithType",
  // "/v2/user/demo/signupopen",
  // "/v2/user/register/mail",
  // "/v2/user/real/signupopen",
  // '/v2/user/pwd/modify',
  // "/v2/user/reset/password/email",
  // "/v2/user/reset/password/phone",
];
// aesUrls = [
//   "/v2/user/info",
//   "/v2/user/phone/bind/check", //好像没有用到
//   "/v2/user/email/bind/check" //好像没有用到
// ];
let SERVER_TIME_INTERVAL = 0;
// axios.defaults.headers.common['X-Api-Token'] = window.localStorage.getItem(TOKEN)
// axios.defaults.headers.common['X-Language'] = language.getType()

const originHost = window.location.host;
let host = "";
// 设置域名 后端会读取index.html的内容, 并且对 window._API_HOST_ 变量赋值,
// 如果没有赋值或者 window._API_HOST_ = '${apiUrl}' 为原始值的情况, 不修改host
// host会做为ajax请求的域名;
!(function() {
  const apiHost = window._API_HOST_;
  if (!apiHost || apiHost === "#{apiUrl}") return;
  host = apiHost;
})();

// 获取当前协议头 是http或者https;
const getProtocol = () => {
  const rotocolStr = document.location.protocol;
  return rotocolStr && rotocolStr.substring(0, rotocolStr.length - 1);
};

class Api {
  constructor(opts) {
    methods.forEach(
      method =>
        (this[method] = (path, data = {}, token, option = {}) =>
          new Promise((resolve, reject) => {
            const _s = new Date().getTime() + SERVER_TIME_INTERVAL;
            // Object.assign(data, { _: t })
            let config = {
              headers: {
                "Content-Type": "application/json",
                Hostd: originHost,
                "X-Api-Token":
                  token || window.localStorage.getItem(TOKEN) || "",
                "x-api-account-token":
                  window.localStorage.getItem(ACCOUNT_TOKEN) || "",
                "X-Language": language.getType(),
                schemed: getProtocol()
              }
            };
            data =
              paramsMethods.indexOf(method) !== -1
                ? { params: data, ...config }
                : data;
            if (rsaUrls.indexOf(path) != -1) {
              data = RSAEncrypt(data);
            }
            if (aesUrls.indexOf(path) != -1) {
              data = AESEncrypt(data);
            }
            let _path = utils.isFullUrl(path) ? path : `${host}/api${path}`;
            _path =
              _path.indexOf("?") === -1
                ? _path + "?t=" + _s
                : _path + "&t=" + _s;
            let request = axios[method](_path, data, config)
              .then(
                ({ data }) => {
                  // if (process.env.NODE_ENV !== "production") {
                  //   let _t = new Date().getTime() - _s;
                  //   if (_t > 1000) {
                  //     console.warn(`请求接口${path}耗时${_t / 1000}秒`);
                  //   } else if (_t > 500) {
                  //     console.info(`请求接口${path}耗时${_t}ms`);
                  //   } else {
                  //     console.log(`请求接口${path}耗时${_t}ms`);
                  //   }
                  // }
                  // setTimeout(() => resolve(data), 1e4)
                  // resolve({ result: false, mcode: 'PUB_AUTH_0000058' })
                  if (aesUrls.indexOf(path) != -1) {
                    data = AESDecrypt(data);
                  }
                  if (data && data.time) {
                    SERVER_TIME_INTERVAL = data.time - new Date().getTime();
                  }
                  resolve(data);
                },
                rej => {
                  console.error(`请求接口${path}错误：${rej}`);
                }
              )
              .catch(err => {
                console.log(err);
              });
          }))
    );
  }
}
export default new Api();
