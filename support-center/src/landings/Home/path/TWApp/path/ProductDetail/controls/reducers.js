import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_PRODUCT_DETAIL,
  GET_MONTH_CHARGE
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------



export const produceDetail = handleActions({
  [GET_PRODUCT_DETAIL]: (state, { payload }) => {
    return {
      appName: payload['appName'],
      activeUserNum: payload['activeUserNum'],
      numLimited: payload['numLimited'],
      userNum: payload['userNum'],
      versionId: payload['versionId'],
      versionName: payload['versionName'],
      expired: payload['expired'],
      started: payload['started'],
      appLogos: payload['appLogos'],
      modules: payload['modules'],
      qrdata: payload['qrdata']
    };
  }
}, {
  appName: '',
  activeUserNum: 0,
  numLimited: 0,
  userNum: 0,
  versionId: '',
  versionName: '',
  expired: undefined,
  started: undefined,
  appLogos: [],
  modules: [],
  qrdata: ''
});

export const monthCharge = handleActions({
  [GET_MONTH_CHARGE]: (state, { payload }) => {
    return {
      start: payload['start'],
      end: payload['end'],
      volume: payload['volume']
    };
  }
}, {
  start: '',
  end: '',
  volume: 0,
});