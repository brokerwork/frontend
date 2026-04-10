import { handleActions } from 'redux-actions';
import i18n from 'utils/i18n';

import { get as __getPageSize__, set as __setPageSize__ } from 'utils/pageSize';
import { dateRange as __dateRange__ } from 'utils/config';

import {
  GET_CUSTOMERS,
  UPDATE_SELECTED_ITEMS,
  REVERT_CUSTOMERS,
  UPDATE_CURRENT_SORT_PARAM,
  UPDATE_PAGENATION_INFO,
  UPDATE_PAGENATION_TOTAL,
  UPDATE_DATE_RANGE,
  UPDATE_FUZZY_SEARCH_TYPE,
  UPDATE_SEARCH_DATE,
  UPDATE_STATE_TYPE,
  RESET_CUSTOMER,
  DESTROY_CUSTOMER,
  UPDATE_FUZZY_SEARCH_TEXT,
  UPDATE_FIELD_CONDITIONS
} from './actions';

import {
  TRASH_HEADER_FIELDS,
  TRANSH_TIME_SEARCH_TYPE,
  SELECTABLED_CUSTOMER_STATE_TYPES
} from '../constant';
import { FUZZY_SEARCH_TYPES, CUSTOMER_STATE_TYPES } from '../../../constant';
import { GET_TENANT_TYPE } from '../../../controls/actions';

const pageSizeKey = 'trash_list';
const getPageSize = __getPageSize__.bind(this, pageSizeKey);
const setPageSize = __setPageSize__.bind(this, pageSizeKey);

export const customersList = handleActions(
  {
    [GET_CUSTOMERS]: (state, { payload }) => {
      return payload.list;
    }
  },
  []
);

export const selectedItemsMap = handleActions(
  {
    [UPDATE_SELECTED_ITEMS]: (state, { payload }) => payload,
    [DESTROY_CUSTOMER]: () => ({}),
    [RESET_CUSTOMER]: () => ({})
  },
  {}
);

const defaultSortParam = {
  sortBy: 'ModifyTime',
  orderDesc: true
};
export const currentSortParam = handleActions(
  {
    [UPDATE_CURRENT_SORT_PARAM]: (state, { type, payload }) => payload
  },
  defaultSortParam
);

export const customerColumns = handleActions({}, TRASH_HEADER_FIELDS);

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

const defaultDateRange = {
  startDate: __dateRange__.all.start,
  endDate: __dateRange__.all.end
};
//时间范围
export const dateRange = handleActions(
  {
    [UPDATE_DATE_RANGE]: (state, { type, payload }) => payload
  },
  defaultDateRange
);

export const fuzzySearchType = handleActions(
  {
    [UPDATE_FUZZY_SEARCH_TYPE]: (state, action) => action.payload
  },
  FUZZY_SEARCH_TYPES[0]
);

export const fuzzySearchText = handleActions(
  {
    [UPDATE_FUZZY_SEARCH_TEXT]: (state, action) => {
      return action.payload;
    }
  },
  ''
);

const defaultSearchDate = {
  label: i18n['customer.contacts_module.delete_time'],
  value: 'ModifyTime'
};

export const searchDate = handleActions({}, defaultSearchDate);

export const tenantType = handleActions(
  {
    [GET_TENANT_TYPE]: (state, { type, payload }) => {
      return payload === true ? 'inner' : 'outer';
    }
  },
  'outer'
);
export const customerStates = handleActions(
  {
    [GET_TENANT_TYPE]: (state, { type, payload }) => {
      return CUSTOMER_STATE_TYPES[payload === true ? 'inner' : 'outer'];
    }
  },
  CUSTOMER_STATE_TYPES['outer']
);

export const selectabledCustomerStateTypes = handleActions(
  {
    [GET_TENANT_TYPE]: (state, { type, payload }) => {
      return SELECTABLED_CUSTOMER_STATE_TYPES[
        payload === true ? 'inner' : 'outer'
      ];
    }
  },
  SELECTABLED_CUSTOMER_STATE_TYPES['outer']
);
export const currentCustomerState = handleActions(
  {
    [UPDATE_STATE_TYPE]: (state, { type, payload }) => payload,
    [GET_TENANT_TYPE]: (state, { type, payload }) => {
      return payload === true
        ? SELECTABLED_CUSTOMER_STATE_TYPES['inner'][0]
        : '';
    }
  },
  ''
);

export const searchFieldConditions = handleActions(
  {
    [UPDATE_FIELD_CONDITIONS]: (state, { type, payload }) => {
      const copyData = payload.concat();
      return copyData.filter(
        item => item.value !== '' && item.value !== undefined
      );
    }
  },
  []
);
