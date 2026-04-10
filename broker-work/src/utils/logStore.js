import fetch from 'isomorphic-fetch';
// 上报错误日志到阿里云
let tenantType = 'test';
const logProject = 'brokerwork4';
const logHost = 'cn-hongkong.log.aliyuncs.com';
const logStore = 'bw-frontend';

const sendLogToLogstore = ({ url, body, requestHeaders, resultData }) => {
  // 错误日志上报至阿里云logstore
  if (!['normal', 'channel'].includes(tenantType)) return;
  if (resultData && !resultData.result) {
    let logStoreUrl = `//${logProject}.${logHost}/logstores/${logStore}/track`;
    const data = {
      APIVersion: '0.6.0',
      host: location.host,
      api: url,
      response: encodeURIComponent(JSON.stringify(resultData)),
      requestBody: encodeURIComponent(JSON.stringify(body)),
      requestHeader: encodeURIComponent(JSON.stringify(requestHeaders))
    };
    const paramStr = [];
    for (let k in data) {
      const item = data[k];
      paramStr.push(`${k}=${item}`);
    }
    logStoreUrl += `?${paramStr.join('&')}`;
    // 使用fetch 而不是使用ajax.js中的方法是因为不用执行ajax.js中那些复杂的逻辑。
    fetch(logStoreUrl);
  }
};

export const setTenantType = v => {
  tenantType = v;
};

export default sendLogToLogstore;
