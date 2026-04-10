import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------

import {
  MODIFY_PARAMS,
  GET_BOX_STATUS,
  GET_MESSAGES,
  SELECT_ITEM,
  GET_AVALIABLE_EMAILS,
  SET_PAGE_TITLE,
  UPDATE_UPDATE_TIME,
  MARK_AS_READ
} from './actions';

import { GET_CURRENT_USER_RIGHT } from 'commonActions/actions';
import { MESSAGE_TYPES } from '../constant';

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const typesOptions = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      return MESSAGE_TYPES.filter(item => payload[item.right]);
    }
  },
  []
);

export const pageTitle = handleActions(
  {
    [SET_PAGE_TITLE]: (state, { payload }) => payload
  },
  ''
);

export const messages = handleActions(
  {
    [GET_MESSAGES]: (state, { payload }) => {
      return payload.list;
    },
    [MARK_AS_READ]: (state, { payload }) => {
      const { ids } = payload;
      //本地数据标记对应的item为已读
      return state.map(item => {
        if (ids && ids.includes(item.inboxId)) {
          item.read = true;
        }
        return item;
      });
    }
  },
  []
);

export const avaliableEmails = handleActions(
  {
    [GET_AVALIABLE_EMAILS]: (state, { payload }) => payload
  },
  []
);

export const selectedItem = handleActions(
  {
    [SELECT_ITEM]: (state, { payload }) => payload
  },
  {}
);

export const paginationInfo = handleActions(
  {
    [GET_MESSAGES]: (state, { payload }) => {
      const size = payload['size'];
      // if (payload['size'] && getPageSize() !== size) {
      //   setPageSize(size);
      // }
      return {
        pageNo: payload['pager'],
        pageSize: size,
        total: payload['total']
      };
    }
  },
  {
    pageNo: 0,
    pageSize: 0,
    total: 0
  }
);

export const searchParams = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => payload
  },
  {
    page: 1,
    size: 20,
    isActive: true,
    queryContent: '',
    // queryKey: 'title',
    queryType: 'RECYCLE_INBOX',
    type: 'ALL'
  }
);

export const boxStatus = handleActions(
  {
    [GET_BOX_STATUS]: (status, { payload }) => payload
  },
  {
    inboxUnreadNumber: 0,
    isSendFailure: false
  }
);

export const listUpdateTime = handleActions(
  {
    [UPDATE_UPDATE_TIME]: (state, { payload }) => payload
  },
  ''
);

import * as addMessageReducers from '../path/AddMessage/controls/reducers';
import * as detailsReducers from '../path/Details/controls/reducers';
export const addMessage = combineReducers(addMessageReducers);
export const details = combineReducers(detailsReducers);
