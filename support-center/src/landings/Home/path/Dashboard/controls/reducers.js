import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------
import { GET_EMAIL_SERVICE_INFO, GET_EXCHANGE_RATE, GET_VIDEO_SERVICE, GET_VOUCHER_LIST } from './actions';

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const emailServiceInfo = handleActions(
  {
    [GET_EMAIL_SERVICE_INFO]: (state, { payload }) => payload
  },
  {}
);

export const exchangeRate = handleActions(
  {
    [GET_EXCHANGE_RATE]: (state, { payload }) => payload
  },
  0
);

export const videoService = handleActions(
  {
    [GET_VIDEO_SERVICE]: (state, { payload }) => payload
  },
  {}
);

export const voucherList = handleActions(
  {
    [GET_VOUCHER_LIST]: (state, { payload }) => payload
  },
  { list: [], pager: 1, size: 20, total: 0 }
);
