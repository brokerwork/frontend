require('babel-polyfill');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {MailBind} from './components/mailbind';
import {InterceptorLoader,InterceptorNames} from '../common/interceptorLoader';

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
               <IndexRoute component={MailBind}/>
               <Route path="mailbind" component={MailBind} />
            </Route>
    </Router>
    ,document.getElementById('main')
);
});
