import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import {
  GET_LINK_LIST,
  GET_LINK_TYPE,
  GET_SERVER_LIST,
  GET_MT_GROUP_LIST,
  CLEAR_MT_GROUP_LIST,
  UPDATE_CURRENT_PLATFORM,
  GET_LINK_STATISTIC,
  CLEAR_LINK_STATISTIC,
  GET_LEVERAGE_LIST,
  GET_USER_GROUP_LIST,
  CLEAR_USER_GROUP_LIST,
  CLEAR_LEVERAGE_LIST,
  GET_QRCODE,
  UPDATE_CURRENT_STATUS,
  GET_EDIT_LINK_DETAIL
} from './actions';

export const linkList = handleActions(
  {
    [GET_LINK_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const typeList = handleActions(
  {
    [GET_LINK_TYPE]: (state, { type, payload }) => payload
  },
  []
);

export const serverList = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const currentPlatform = handleActions(
  {
    [UPDATE_CURRENT_PLATFORM]: (state, { type, payload }) => payload
  },
  'Web'
);

export const currentStatus = handleActions(
  {
    [UPDATE_CURRENT_STATUS]: (state, { type, payload }) => payload
  },
  ''
);

export const currentEditLink = handleActions(
  {
    [GET_EDIT_LINK_DETAIL]: (state, { type, payload }) => payload
  },
  {}
);

export const mtGroupList = handleActions(
  {
    [GET_MT_GROUP_LIST]: (state, { type, payload }) => payload,
    [CLEAR_MT_GROUP_LIST]: (state, { type, payload }) => []
  },
  []
);

export const linkStatistic = handleActions(
  {
    [GET_LINK_STATISTIC]: (state, { type, payload }) => payload,
    [CLEAR_LINK_STATISTIC]: (state, { type, payload }) => ({})
  },
  {}
);

export const leverageList = handleActions(
  {
    [GET_LEVERAGE_LIST]: (state, { type, payload }) => payload,
    [CLEAR_LEVERAGE_LIST]: (state, { type, payload }) => []
  },
  []
);

export const userGroupList = handleActions(
  {
    [GET_USER_GROUP_LIST]: (state, { type, payload }) => payload,
    [CLEAR_USER_GROUP_LIST]: (state, { type, payload }) => []
  },
  []
);

export const currentQrcode = handleActions(
  {
    [GET_QRCODE]: (state, { type, payload }) => payload
  },
  ''
);
