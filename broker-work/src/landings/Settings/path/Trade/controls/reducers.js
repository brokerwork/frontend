import { handleActions } from 'redux-actions';
import {
  GET_BASIC_INFO,
  GET_ACCOUNT_LIST,
  GET_BALANCE,
  GET_SERVER_BY_VENDOR
} from './actions';

import { DEFAULT_BASIC_INFO } from '../constant';

export const tradeSetting = handleActions(
  {
    [GET_BASIC_INFO]: (state, { type, payload }) => payload
  },
  DEFAULT_BASIC_INFO
);

export const accountList = handleActions(
  {
    [GET_ACCOUNT_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const singleBalance = handleActions(
  {
    [GET_BALANCE]: (state, { type, payload }) => payload
  },
  {}
);

export const serverGroupList = handleActions(
  {
    [GET_SERVER_BY_VENDOR]: (state, { type, payload }) => payload
  },
  []
);
