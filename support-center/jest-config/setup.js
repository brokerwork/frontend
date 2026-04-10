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


