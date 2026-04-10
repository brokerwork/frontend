import axios from 'axios';
// import { global } from "core-js/library/web/timers";
import { Toast } from 'antd-mobile';
import ls, { TOKEN } from '@/utils/storage';

// axios拦截器，在请求发起之前做处理
const beforeRequest = config => {
  config.headers['X-Api-Token'] = ls.get(TOKEN) ? ls.get(TOKEN) : null;
  config.baseURL = location.origin;
  config.params
    ? (config.params.t = Date.now())
    : (config.params = {
        t: Date.now()
      });
  return config;
};
axios.interceptors.request.use(beforeRequest);
class Ajax {
  get(url, params) {
    return axios
      .get(url, params)
      .then(rs => {
        if (!rs.data.result) {
          if (rs.data.mcode === 'PUB_AUTH_0000018') {
            ls.remove(TOKEN);
            location.reload();
          }
          Toast.info(rs.data.mcode);
          return rs.data;
        } else {
          return rs.data;
        }
      })
      .catch(rs => {
        Toast.info('错误代码：' + rs.data.mcode);
      });
  }
  post(url, params) {
    return axios
      .post(url, params)
      .then(rs => {
        if (!rs.data.result) {
          Toast.info('错误代码：' + rs.data.mcode);
          return rs.data;
        } else {
          if (rs.data.data) {
            return rs.data.data;
          } else {
            return rs.data;
          }
        }
      })
      .catch(err => {
        console.log(err, 'debug');
        Toast.info('错误代码：' + err);
      });
  }
}
export default new Ajax();
