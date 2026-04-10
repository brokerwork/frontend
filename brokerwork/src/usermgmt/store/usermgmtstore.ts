import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import * as reduxPromise from 'redux-promise';
import loadingMiddleware from '../../common/middleware/loadingMiddleware'
import errorMiddleware from '../../common/middleware/errorMiddleware'
import mgmtR, {UserMgmtState} from '../reducers/usermgmtreducer';
import binR, {UserRcycleBinState} from '../reducers/userrecyclebinreducer';
import { routerReducer } from 'react-router-redux';
import {salesTargetPageReducer} from '../../customermgmt/reducers/salesTargetReducer';

interface UserAppState {
  userMgmt: UserMgmtState,
  userRecycleBin: UserRcycleBinState
}

let userMgmtStore = createStore(combineReducers({
  userMgmt: mgmtR,
  userRecycleBin: binR,
  salesTargetPage: salesTargetPageReducer,
  routing: routerReducer
}), applyMiddleware(
  loadingMiddleware,
  errorMiddleware,
  reduxPromise,
  thunk
));

export { userMgmtStore, UserAppState };