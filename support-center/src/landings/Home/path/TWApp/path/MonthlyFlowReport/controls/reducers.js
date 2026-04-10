import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import {
  GET_MONTHLY_LIST,
  GET_MONTHLY_DETAIL,
  GET_RECHARGE_PLATFORM,
  GET_EXCHANGE_RATE
} from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------


export const monthlyList = handleActions({
  [GET_MONTHLY_LIST]: (state, { payload }) => payload
}, {});

export const monthlyDeatail = handleActions({
  [GET_MONTHLY_DETAIL]: (state, { payload }) => payload
}, {});


export const platformList = handleActions({
  [GET_RECHARGE_PLATFORM]: (state, { payload }) => {
    return [].concat(payload).map(item => {
      return {
        ...item,
        label: item.name,
        value: item.providerId
      };
    });
  }
}, []);

export const exchangeRate = handleActions({
  [GET_EXCHANGE_RATE]: (state, { payload }) => payload
}, 0);