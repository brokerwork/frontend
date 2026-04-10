// libs
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { hashHistory } from 'react-router';
import {Application} from 'components/Application';
import store from './store';
import injectTapEventPlugin from 'react-tap-event-plugin';
if (!window.Intl){
	window.Intl = require('intl');
} 
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render((
  <Provider store={store}>
    <Application history={history}/>
  </Provider>
), document.getElementById('app'));