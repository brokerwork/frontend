import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import thunkMiddleware from 'middlewares/thunk';
import promiseMiddleware from 'middlewares/promise';
import errorMiddleware from 'middlewares/error';
import loadingMiddleware from 'middlewares/loading';

import * as loginReducers from './controls/reducers';
import * as forgotPasswordReducers from './path/ForgotPassword/controls/reducers';
import * as resetPasswordReducers from './path/ResetPassword/controls/reducers';
import commonReducers from 'commonActions/reducers';

const middlewareList = [
  thunkMiddleware,
  loadingMiddleware,
  promiseMiddleware,
  errorMiddleware
];
if (process.env.NODE_ENV !== 'production') {
  const createLogger = require('redux-logger');
  const loggerMiddleware = createLogger({
    diff: false
  });
  middlewareList.push(loggerMiddleware);
}
const middleware = applyMiddleware(...middlewareList);

const store = createStore(
  combineReducers({
    login: combineReducers(loginReducers),
    forgotPassword: combineReducers(forgotPasswordReducers),
    resetPassword: combineReducers(resetPasswordReducers),
    routing: routerReducer,
    common: commonReducers,
    form: formReducer
  }),
  middleware
);

export default store;
