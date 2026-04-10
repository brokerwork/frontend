require('es6-shim');
require('babel-polyfill');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { userMgmtStore } from './store/usermgmtstore';
import {UserMgmtIndex} from './pages/userMgmt';
import UserBin from './pages/recycleBin'
import RecycleBin from './pages/recycleBin';
import { syncHistoryWithStore } from 'react-router-redux';
let { Router, Route, browserHistory, hashHistory, IndexRoute, Link} = require('react-router');
import {AppHeader} from '../header/index';
import {AppFooter} from '../footer/index';
import {Row, Col, LoadingMask } from 'fooui';
import {I18nLoader} from '../i18n/loader';
import {InterceptorLoader,InterceptorNames} from '../common/interceptorLoader';
import SalesTargetMgmt from '../customermgmt/pages/salesTarget';

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, userMgmtStore);


class App extends React.Component<{},{}>{
    render(){
        return (
            <div>
                <AppHeader activeMenu="usermgmt"/>
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
    InterceptorNames.FileUpload,
    InterceptorNames.UiPrivilege,
    InterceptorNames.CountryCity
]).handle( function(){
    LoadingMask.unmaskAll();
    ReactDOM.render(
        <Provider store={userMgmtStore}>
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRoute component={UserMgmtIndex}/>
                    <Route path="/recyclebin" component={UserBin}/>
                    <Route path="/salesTarget" component={SalesTargetMgmt}/>
                </Route>
            </Router>
        </Provider>

        ,document.getElementById('main')
    );
} )

