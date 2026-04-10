import axios from "axios";
import { message as Message } from "antd";
import qs from "qs";

const instance = axios.create({
  baseURL: "/"
  // timeout: 1000,
  // headers:{}
});

// 添加请求拦截器
instance.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 添加请求时间戳
    if (config.method === "get") {
      config.params.t = Date.now();
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function(res) {
    // 对响应数据做点什么
    const {
      data: { result, message, mcode }
    } = res;
    if (!result) {
      Message.error(message || mcode);
    }
    return res.data;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export const get = (url, params = {}) => {
  return instance.get(`${url}`, {
    params
  });
};

export const post = (url, data = {}, method = "post") => {
  return instance[method](`${url}`, data);
};

export default {
  get,
  post
};
