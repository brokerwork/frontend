import { handleActions } from 'redux-actions';
import i18n from 'utils/i18n';

import { get as __getPageSize__, set as __setPageSize__ } from 'utils/pageSize';
import { dateRange as __dateRange__ } from 'utils/config';

import {
  GET_DUPLICATE,
  UPDATE_PAGENATION_INFO,
  UPDATE_PAGENATION_TOTAL,
  GET_BIND_USER_ID,
  GET_USER_INFO,
  GET_FIELDS
} from './actions';

const pageSizeKey = 'duplicate_list';
const getPageSize = __getPageSize__.bind(this, pageSizeKey);
const setPageSize = __setPageSize__.bind(this, pageSizeKey);

export const duplicatesList = handleActions(
  {
    [GET_DUPLICATE]: (state, { payload }) => {
      return payload;
    }
  },
  []
);

export const paginationInfo = handleActions(
  {
    [UPDATE_PAGENATION_INFO]: (state, { payload }) => {
      const size = Number(payload['pageSize']);
      if (payload['pageSize'] && getPageSize() !== size) {
        setPageSize(size);
      }
      return {
        ...state,
        currentPage: payload.currentPage,
        pageSize: size
      };
    },
    [UPDATE_PAGENATION_TOTAL]: (state, { payload }) => ({
      ...state,
      total: payload
    })
  },
  {
    currentPage: 1,
    pageSize: getPageSize(),
    total: 0
  }
);
export const bindUsersId = handleActions(
  {
    [GET_BIND_USER_ID]: (state, { payload }) => {
      return payload;
    }
  },
  []
);
export const usersInfo = handleActions(
  {
    [GET_USER_INFO]: (state, { payload }) => {
      return payload;
    }
  },
  {}
);
export const fields = handleActions(
  {
    [GET_FIELDS]: (state, { payload }) => {
      return payload;
    }
  },
  {
    t_customer_profiles: [],
    t_account_profiles: [],
    t_account_id_info: [],
    t_account_finacial: []
  }
);
