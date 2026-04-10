import { routerMiddleware, routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { applyMiddleware } from 'redux';
import thunkMiddleware from 'middlewares/thunk';
import promiseMiddleware from 'middlewares/promise';
import errorMiddleware from 'middlewares/error';
import loadingMiddleware from 'middlewares/loading';
import debounceMiddleware from 'middlewares/debounce';

import { createStore } from 'utils/injectReducer';
import commonReducers from 'commonActions/reducers';

const middlewareList = [
  debounceMiddleware,
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

export default history => {
  return createStore(
    {
      routing: routerReducer,
      common: commonReducers,
      form: formReducer
    },
    applyMiddleware(routerMiddleware(history), ...middlewareList)
  );
};
