
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Panel, Row, Col, Button} from 'fooui';
import {AppHeader} from './header/index';
import {SiderBar} from './settings/components/siderbar';
import {BasicInfo} from './settings/components/basicinfo';
import {ChangePwd} from './settings/components/changepwd';
import {AppLogin} from './entrance/components/main';
import {AppRegister} from './entrance/components/register';
import {ForgetPwd} from './entrance/components/forgetpwd';
import {PhoneSetting} from './settings/components/phonesetting';
import {EmailSetting} from './settings/components/emailsetting';
import {PersonalSetting} from './settings/components/personalsetting';
import {UserMgmtIndex } from './usermgmt/components/main';
import {CustomerManagement} from './customermgmt/pages/main';
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
import promiseMiddleware from 'redux-promise';


var App = React.createClass({
    render(){
        return (
            <div style={{height:"100%",width:"100%"}}>{this.props.children}</div>
        )
    }
})


ReactDOM.render(
    <Router history={hashHistory} >
        <Route path="/" component={App}>
            <IndexRoute component={AppLogin}/>
            <Route path="entrance" component={AppLogin}/>
            <Route path="register" component={AppRegister}/>
            <Route path="forgetpwd" component={ForgetPwd}/>
            <Route path="usermgmt" component={UserMgmtIndex}/>
            <Route path="personalsetting" component={PersonalSetting} />
            <Route path="customermgmt" component={CustomerManagement}/>
        </Route>
    </Router>
    ,document.getElementById('main')
);