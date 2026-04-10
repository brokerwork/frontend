const nock = require('nock');
// 这个域名，需要与 utils/ajax 中 testDomain 变量在测试环境下的值相同
// 否则拦截不到测试时，action发出的请求
Object.defineProperty(window, 'nock', {
  get: function() {
    return nock('http://domainfortest.lwork.com')
      .filteringPath((path) => {
        // 去除url中的 /api 以及 t=1236789897654 时间戳 参数
        return path.replace(/(\?|\&)t=[0-9]{10,15}/ig, '')
                .replace(/\/api/ig, '');
      });
  }
});
window.React = require('react');
window.PureComponent = React.PureComponent;
window.Component = React.Component;
window.__PROD__ = false;

class Storage {
  __key__ = {}
  getItem(key) {
    return this[key] || null;
  }
  setItem(key, value) {
    this.__key__[key] = value;
    this[key] = value;
  }
  removeItem(key) {
    delete this[key];
  }
  clear() {
    const keys = Object.keys(this.__key__);
    keys.forEach((key, index) => {
      delete this[key];
    });
    this.__key__ = {};
  }
}

window.localStorage = new Storage();
window.sessionStorage = new Storage();


