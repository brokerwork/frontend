require('es6-shim');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { createStore, combineReducers, applyMiddleware } from 'redux';
let { Router, Route, browserHistory, hashHistory, IndexRoute, Link} = require('react-router');
import thunk from 'redux-thunk';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import TaskListView from './pages/taskListView';
import TaskDashboardView from './pages/taskDashboardView';
import taskReducer from './reducers';
import {AppFooter} from '../footer';
import {I18nLoader} from '../i18n/loader';
import {InterceptorLoader,InterceptorNames} from '../common/interceptorLoader';

// Add the reducer to your store on the `routing` key
let rootStore = createStore(
    combineReducers({
        taskPage: taskReducer,
        routing: routerReducer
    }),
    applyMiddleware(thunk)
)

rootStore.subscribe(function(){
    // );
})

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, rootStore);

class App extends React.Component<{}, {}>{
    render(){
        return (
            <div className="app">
                {this.props.children}
                <AppFooter/>
            </div>
        )
    }
}

new InterceptorLoader([
    InterceptorNames.UserInfo,
    InterceptorNames.I18n,
    InterceptorNames.FileUpload,
    InterceptorNames.CountryCity,
    InterceptorNames.UiPrivilege
]).handle(function(){
    ReactDOM.render(
        <Provider store={rootStore}>
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRoute component={TaskDashboardView}/>
                    <Route path="/listview" component={TaskListView}/>
                    <Route path="/dashboardview" component={TaskDashboardView}/>
                </Route>
            </Router>
        </Provider>

        ,document.getElementById('main')
    )
})

