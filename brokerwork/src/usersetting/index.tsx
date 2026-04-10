require('es6-shim');
require('babel-polyfill');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EmailSetting} from './components/emailsetting';
import {ChangePwd} from './components/changepwd';
import {BasicInfo} from './components/basicinfo';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {I18nLoader} from '../i18n/loader';
import {InterceptorLoader,InterceptorNames} from '../common/interceptorLoader';
import {AppFooter} from '../footer/index';
import { AppHeader } from '../header/index';
import { LoadingMask } from 'fooui';

import setPageTitle from '../common/setPageTitle';

class App extends React.Component<{}, {}>{
    componentDidMount() {
        setPageTitle(I18nLoader.get('navigation.personal_center.module_name'));
    }
    
    render(){
        return (
            <div>
                <AppHeader/>
                  <div className="mainContent">
                   {this.props.children}
                  </div>
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
    InterceptorNames.ParameterType
]).handle( function(){
    LoadingMask.unmaskAll();
    ReactDOM.render(
        <Provider>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={ChangePwd}/>
                    <Route path="changepwd" component={ChangePwd}/>
                    <Route path="emailsetting" component={EmailSetting}/>
                </Route>
            </Router>
        </Provider>
        , document.getElementById('main')
    );
} )
