import { handleActions } from 'redux-actions';

import {
  CUSTOMER_STATE_TYPES,
  PRODUCT_LIST,
  REPORT_TYPES,
  TIME_UNITS,
  FUZZY_ITEM_LIST,
  FILTER_TYPES,
  DEFAULT_DATE_RANGE,
  BILL_REFUND_VIEWS
} from '../contants';

import {
  formatDateRangeByTimeUnit,
  formatTimeLine,
  getParsedSearchTypes
} from '../utils';

import { GET_CURRENT_USER_RIGHT } from 'commonActions/actions';

import {
  MODIFY_PARAMS,
  UPDATE_TIME_LINE,
  GET_REPORTS,
  UPDATE_PAGE_INFO,
  REPORT_PAYMENT_PAGE_SIZE_KEY,
  UPDATE_BILL_REFUND_VIEW
} from './actions';

import { get as getPageSize, set as setPageSize } from 'utils/pageSize';

export const params = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      const parsed = getParsedSearchTypes(payload);
      const searchTypeObj =
        parsed.find(item => item.value === 'all') || parsed[0] || '';
      return {
        ...state,
        filterType: searchTypeObj.value || ''
      };
    },
    [MODIFY_PARAMS]: (state, { payload }) => {
      return payload;
    }
  },
  {
    customerState: '',
    product: '',
    type: 'refund_bill',
    timeUnit: 'month',
    filterType: '',
    fuzzyItem: 'CustomerName',
    pageSize: getPageSize(REPORT_PAYMENT_PAGE_SIZE_KEY),
    ...formatDateRangeByTimeUnit(DEFAULT_DATE_RANGE, 'month')
  }
);

export const currentPageInfo = handleActions(
  {
    [UPDATE_PAGE_INFO]: (state, { payload }) => {
      const size = Number(payload['pageSize']);
      if (
        payload['pageSize'] &&
        getPageSize(REPORT_PAYMENT_PAGE_SIZE_KEY) !== size
      ) {
        setPageSize(REPORT_PAYMENT_PAGE_SIZE_KEY, size);
      }

      return payload;
    }
  },
  { pageNo: 1, pageSize: getPageSize(REPORT_PAYMENT_PAGE_SIZE_KEY) }
);

export const customerStateTypes = handleActions(
  {},
  CUSTOMER_STATE_TYPES.filter(item => !item.disabled)
);

export const productList = handleActions({}, PRODUCT_LIST);

export const reportTypes = handleActions({}, REPORT_TYPES);

export const timeUnits = handleActions({}, TIME_UNITS);

export const fuzzyItemList = handleActions({}, FUZZY_ITEM_LIST);

export const filterTypes = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) =>
      getParsedSearchTypes(payload)
  },
  []
);

export const tableTimeLine = handleActions(
  {
    [UPDATE_TIME_LINE]: (state, { payload }) => payload
  },
  {
    header: [],
    list: [],
    type: ''
  }
);

export const reportList = handleActions(
  {
    [GET_REPORTS]: (state, { payload }) => payload.list || []
  },
  []
);

export const reportSta = handleActions(
  {
    [GET_REPORTS]: (state, { payload }) => payload.sta || []
  },
  []
);

export const listLoadAndEmpty = handleActions(
  {
    [GET_REPORTS]: (state, { payload }) =>
      !(
        (payload.list && payload.list.length) ||
        (payload.sta && Object.keys(payload.sta).length)
      )
  },
  false
);

export const billRefundViews = handleActions({}, BILL_REFUND_VIEWS);

export const billRefundViewKey = handleActions(
  {
    [UPDATE_BILL_REFUND_VIEW]: (state, { payload }) => payload
  },
  BILL_REFUND_VIEWS[0].value
);
//MRR  ACTUAL
