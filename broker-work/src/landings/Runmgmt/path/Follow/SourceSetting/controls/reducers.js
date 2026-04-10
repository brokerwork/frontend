import { handleActions } from 'redux-actions';
import {
  GET_LIST,
  ADD_SOURCE,
  LOCK_SOURCE,
  UNLOCK_SOURCE,
  MODIFY_PARAMS,
  GET_SERVER_LIST,
  EDIT_SOURCE,
  IS_EXPIRE
} from './actions';

export const sourceList = handleActions(
  {
    [GET_LIST]: (state, { payload }) => {
      return payload;
    },
    [UNLOCK_SOURCE]: (state, { payload }) => {
      const list = state.list.map(val => {
        if (payload.id === val.tradeId) {
          return {
            ...val,
            state: 0
          };
        }
        return val;
      });
      return {
        list
      };
    },
    [LOCK_SOURCE]: (state, { payload }) => {
      const list = state.list.map(val => {
        if (payload.id === val.tradeId) {
          return {
            ...val,
            state: 2
          };
        }
        return val;
      });
      return {
        list
      };
    },
    [EDIT_SOURCE]: (state, { payload }) => {
      const list = state.list.map(val => {
        if (payload.tradeId === val.tradeId) {
          return {
            ...val,
            investmentStrategy: payload.investmentStrategy
          };
        }
        return val;
      });
      return {
        list
      };
    }
  },
  {
    list: []
  }
);

export const serverList = handleActions(
  {
    [GET_SERVER_LIST]: (state, { payload }) => payload
  },
  {
    MT4: []
  }
);

export const searchParams = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => payload
  },
  {
    currPage: 1,
    pageSize: 20,
    state: '3',
    type: '0',
    orderValue: '',
    tradeName: '',
    sort: ''
  }
);

export const navigationInfo = handleActions(
  {
    [GET_LIST]: (state, { payload }) => ({
      pageNo: payload.pageNo,
      pageSize: payload.pageSize,
      total: payload.total,
      pages: payload.pages
    })
  },
  {
    pageNo: 1,
    pageSize: 20,
    total: 0
  }
);

/**
 * true表示没有过期，false表示已经过期
 */
export const expire = handleActions(
  {
    [IS_EXPIRE]: (state, { payload }) => payload
  },
  true
);
