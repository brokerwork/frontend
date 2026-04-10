require('babel-polyfill');
import {InterceptorLoader,InterceptorNames} from '../common/interceptorLoader';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {MsgSiderBar} from "./components/siderbar";
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {AppHeader} from '../header/index';
import {ReceiveBox} from './components/receivebox';
import {SendBox} from './components/sendbox';
import {DraftBox} from './components/draftbox';
import {RecycleBox} from './components/recyclebox';
import {Details} from './components/details';
import {AddModMessage} from './components/addModMessage';
import {BatchTools} from './components/batchtools';
import {AddMessage} from './components/addMessage';
import {EditDraft} from './components/editdraft';
import {IntlProvider} from 'react-intl';

import setPageTitle from '../common/setPageTitle';
import {I18nLoader} from '../i18n/loader';

var rootStore = createStore(combineReducers({
    routing: routerReducer
}), applyMiddleware(thunkMiddleware))


class App extends React.Component<{}, {}>{
    constructor(props){
        super(props);
        setPageTitle(I18nLoader.get('navigation.message.module_name'));
    }
    render(){
        return (
            <div className="app">
                <AppHeader/>
                <MsgSiderBar/>
                <div className="mail-box-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
new InterceptorLoader([
    InterceptorNames.UserInfo,
    InterceptorNames.I18n,
    InterceptorNames.UiPrivilege,
    InterceptorNames.FileUpload
]).handle( function(){
    ReactDOM.render(
        <Provider store={rootStore}>
            <IntlProvider locale="en">
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={ReceiveBox}/>
                    <Route path="/receivebox" component={ReceiveBox}/>
                    <Route path="/sendbox" component={SendBox}/>
                    <Route path="/draftbox" component={DraftBox}/>
                    <Route path="/recyclebox" component={RecycleBox}/>
                    <Route path="/details/:messageid" component={Details}/>
                    <Route path="/addModMessage" component={AddModMessage}/>
                    <Route path="/addMessage" component={AddMessage}/>
                    <Route path="/editdraft/:mesid" component={EditDraft}/>
                </Route>
            </Router>
            </IntlProvider>
        </Provider>
        ,document.getElementById('main')
    )}
)

