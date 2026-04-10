/*客户管理主页面*/
require('es6-shim');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

let { Router, Route, browserHistory, hashHistory, IndexRoute, Link} = require('react-router');

import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import { AppHeader } from '../header/index';
import { InterceptorLoader, InterceptorNames } from '../common/interceptorLoader';
import { mt4Store } from './store/mt4store';
import Mt4Acct from './pages/mt4';
import Mt5Acct from './pages/mt5';
import { LoadingMask } from 'fooui';
import { HttpClient } from '../http/httpclient';
import { Button} from 'fooui'
import {AppFooter} from '../footer/index';

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, mt4Store);


class App extends React.Component<{}, {}>{
    render(){
        return (
            <div className="app">
                <AppHeader/>
                {this.props.children}
                <AppFooter/>
            </div>
        )
    }
}


LoadingMask.maskAll();
new InterceptorLoader([
    InterceptorNames.UserInfo,
    InterceptorNames.I18n,
    InterceptorNames.UiPrivilege,
    InterceptorNames.FileUpload
]).handle( function(){
    ReactDOM.render(
        <Provider store={ mt4Store }>
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRoute component={Mt4Acct}/>
                    <Route path="/mt4acct" component={Mt4Acct}/>
                    <Route path="/mt5acct" component={Mt5Acct}/>
                </Route>
            </Router>
        </Provider>

        ,document.getElementById('main')
    );
} )

