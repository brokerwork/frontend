require('babel-polyfill');
require('bowser');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppLogin} from './components/main';
import {AppRegister} from './components/register';
import {ForgetPwd } from './components/forgetpwd';
import {ResetPwd} from './components/resetpwd';
import {InterceptorLoader,InterceptorNames} from '../common/interceptorLoader';
import {I18nLoader} from '../i18n/loader';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

var App = React.createClass({
    render(){
        return (
            <div style={{height:"100%", width:"100%"}}>{this.props.children}</div>
        )
    }
});

new InterceptorLoader([
    InterceptorNames.I18n
]).handle( function(){
    ReactDOM.render(
    <Router history={hashHistory} >
        <Route path="/" component={App}>
               <IndexRoute component={AppLogin}/>
               <Route path="entrance" component={AppLogin}/>
               <Route path="appregister" component={AppRegister} />
               <Route path="forgetpwd" component={ForgetPwd} />
               <Route path="resetpwd" component={ResetPwd} />
            </Route>
    </Router>
    ,document.getElementById('main')
);
} )
