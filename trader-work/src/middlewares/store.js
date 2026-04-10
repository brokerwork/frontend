import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware } from 'redux';
import thunkMiddleware from './thunk';
import promiseMiddleware from './promise';
import errorMiddleware from './error';
import loadingMiddleware from './loading';

import { createStore } from '@/utils/injectReducer';
import common from '@/reducers/Common/common';
// import { reducer as formReducer  } from 'redux-form';

const middlewareList = [
  thunkMiddleware,
  loadingMiddleware,
  promiseMiddleware,
  errorMiddleware,
];
if (process.env.NODE_ENV !== 'production') {
  const { createLogger } = require('redux-logger');
  const loggerMiddleware = createLogger({
    diff: false,
  });
  // middlewareList.push(loggerMiddleware);
}

export default (history) => {
  return createStore({
      routing: routerReducer,
      common: common,
      // form: formReducer
    },
    applyMiddleware(
      routerMiddleware(history),
      ...middlewareList
    )
  );
};