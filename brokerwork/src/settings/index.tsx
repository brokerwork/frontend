require('es6-shim');
require('babel-polyfill');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EmailSetting} from './components/emailsetting';
import {PhoneSetting} from './components/phonesetting';
import {SiderBar} from './components/siderbar';
import {ChangePwd} from './components/changepwd';
import {PersonalSetting} from './components/personalsetting';
import {BasicLog} from './components/basiclog';
import {UserLog} from './components/userlog';
import {MessageLog} from './components/messagelog';
import {CustomerLog} from './components/customerlog';
import {MissionLog} from './components/missionlog';
import {SystemLog} from './components/systemlog';
import {AccountLog} from './components/accountlog';
import {RegisterSetting} from './components/registersetting';
import {LoginSetting} from './components/loginsetting';
import {RoleSetting} from './components/rolesetting';
import {LinkSetting} from './components/linksetting';
import {ProductSetting} from './components/productsetting';
import {ProjectSetting} from './components/projectsetting';
import {UserField} from './components/userfield';
import {CustomerField} from './components/customerfield';
import {MissionField} from './components/missionfield';
import {CommissionField} from './components/commissionfield';
import {RuleListSetting} from './components/rulelistsetting';
import {EmailPostSetting} from './components/emailpostsetting';
import {MessageTemplate} from './components/messagetemplate';
import {AccountSetting} from './components/accountsetting';
import {UserHierarchySetting} from './components/userhierarchysetting';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {I18nLoader} from '../i18n/loader';
import { LoadingMask } from 'fooui';
import {InterceptorLoader,InterceptorNames} from '../common/interceptorLoader';
import {IntlProvider} from 'react-intl';

import setPageTitle from '../common/setPageTitle';

var rootStore = createStore(combineReducers({
    routing: (state = {}, action)=> {
        return state
    }
}), applyMiddleware(thunkMiddleware))

LoadingMask.maskAll();
new InterceptorLoader([
    InterceptorNames.UserInfo,
    InterceptorNames.I18n,
    InterceptorNames.FileUpload,
    InterceptorNames.UiPrivilege,
    InterceptorNames.ParameterType
]).handle( function(){
    LoadingMask.unmaskAll();
    setPageTitle(I18nLoader.get('navigation.setting.module_name'));
    ReactDOM.render(
        <Provider store={rootStore}>
            <IntlProvider locale="en">
            <Router history={hashHistory}>
                <Route path="/" component={PersonalSetting}>
                    <IndexRoute component={MessageTemplate}/>
                    <Route path="basiclog" component={BasicLog}/>
                    <Route path="userlog" component={UserLog}/>
                    <Route path="messagelog" component={MessageLog}/>
                    <Route path="customerlog" component={CustomerLog}/>
                    <Route path="missionlog" component={MissionLog}/>
                    <Route path="systemLog" component={SystemLog}/>
                    <Route path="accountLog" component={AccountLog}/>
                    <Route path="loginsetting" component={LoginSetting}/>
                    <Route path="registersetting" component={RegisterSetting}/>
                    <Route path="rolesetting" component={RoleSetting}/>
                    <Route path="linksetting" component={LinkSetting}/>
                    <Route path="productsetting" component={ProductSetting}/>
                    <Route path="projectsetting" component={ProjectSetting}/>
                    <Route path="userfield" component={UserField}/>
                    <Route path="customerfield" component={CustomerField}/>
                    <Route path="missionfield" component={MissionField}/>
                    <Route path="commissionField" component={CommissionField}/>
                    <Route path="rulelistsetting" component={RuleListSetting}/>
                    <Route path="emailpostsetting" component={EmailPostSetting}/>
                    <Route path="messagetemplate" component={MessageTemplate}/>
                    <Route path="accountsetting" component={AccountSetting}/>
                    <Route path="userhierarchysetting" component={UserHierarchySetting}/>
                </Route>
            </Router>
            </IntlProvider>
        </Provider>
        , document.getElementById('main')
    );
} )
