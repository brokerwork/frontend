import { render as domRender } from 'react-dom';
import { Router } from 'react-router';
import Routes from './router';
import { createBrowserHistory, createHashHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Provider } from 'mobx-react';
import { configure } from 'mobx';
import commonStore from './commonStore';
import * as React from 'react';
const browserHistory = createHashHistory(); //路由不好处理，暂用hash吧
const routingStore = new RouterStore();
export const history = syncHistoryWithStore(browserHistory, routingStore);

configure({
  enforceActions: 'always'
});
const store = {
  commonStore
};
const Root = (
  <Provider {...store}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>
);
domRender(Root, document.getElementById('root'));
