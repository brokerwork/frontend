import { handleActions } from 'redux-actions';
import { CONTRACT_FIELDS_MAP, PRODUCT_LIST } from '../constants';
import { deepCopy } from 'utils/simpleDeepCopy';

import { OPPORTUNITIES_OF_CUSTOMER_BY_ID } from '../../Customers/controls/actions';
import {
  GET_PRODUCT_LIST,
  GET_BILL_DETAIL,
  GET_REFOND_LIST,
  CLEAR_REFUND_LIST,
  GET_IS_LOST_CUSTOMER
} from './actions';

export const productList = handleActions({}, PRODUCT_LIST);

export const billDetail = handleActions(
  {
    [GET_BILL_DETAIL]: (state, { type, payload }) => payload
  },
  {}
);

export const refundList = handleActions(
  {
    [GET_REFOND_LIST]: (state, { type, payload }) => payload,
    [CLEAR_REFUND_LIST]: (state, { type, payload }) => []
  },
  []
);

export const exportDataReady = handleActions({}, true);

export const isLostCustomer = handleActions(
  {
    [GET_IS_LOST_CUSTOMER]: (state, { type, payload }) => payload,
    [GET_BILL_DETAIL]: () => true
  },
  true
);
