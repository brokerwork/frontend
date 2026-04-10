/*客户管理主页面*/
require('es6-shim');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { createStore, combineReducers, applyMiddleware } from 'redux';
let { Router, Route, browserHistory, hashHistory, IndexRoute, Link} = require('react-router');
import thunk from 'redux-thunk';
import * as reduxPromise from 'redux-promise';
import loadingMiddleware from '../common/middleware/loadingMiddleware';
import errorMiddleware from '../common/middleware/errorMiddleware';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import {customerPageReducer} from './reducers/customerPageReducer';
import {salesTargetPageReducer} from './reducers/salesTargetReducer';
import {salesContractReducer} from './reducers/salesContractReducer';
import {customerRcycleBinPageReducer} from './reducers/customerRcycleBinPageReducer';
import {contactsReducer} from './reducers/contactsReducer';
import SalesReport from './pages/salesReport';
import RecycleBin from './pages/recycleBin';
import SalesContract from './pages/salesContract';
import CustomerManagement from './pages/customerMgmt';
import Contacts from './pages/contacts';
import ContactsRecycleBin from './pages/contactsRecycleBin';
import {AppHeader} from '../header/index';
import {InterceptorLoader,InterceptorNames} from '../common/interceptorLoader';
import { LoadingMask } from 'fooui';

// Add the reducer to your store on the `routing` key
let rootStore = createStore(
    combineReducers({
        customerPage: customerPageReducer,
        salesTargetPage: salesTargetPageReducer,
        recycleBinPage: customerRcycleBinPageReducer,
        salesContractPage: salesContractReducer,
        contactsPage: contactsReducer,
        routing: routerReducer
    }),
    applyMiddleware(
        loadingMiddleware,
        errorMiddleware,
        reduxPromise,
        thunk
    )
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, rootStore);


class App extends React.Component<{}, {}>{
    render(){
        return (
            <div className="app">
                <AppHeader activeMenu="usermgmt"/>
                {this.props.children}
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
        <Provider store={rootStore}>
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRoute component={CustomerManagement}/>
                    <Route path="/salesReport" component={SalesReport}/>
                    <Route path="/recyclebin" component={RecycleBin}/>
                    <Route path="/contacts" component={Contacts} />
                    <Route path="/contracts" component={SalesContract} />
                    <Route path="/contactsRecycleBin" component={ContactsRecycleBin} />
                </Route>
            </Router>
        </Provider>

        ,document.getElementById('main')
    );
} )
