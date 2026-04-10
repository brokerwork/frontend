import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { DEFAULT_DATE_RANGE } from '../contants';
import moment from 'moment';
import { formatDateRangeByTimeUnit, formatTimeLine } from '../utils';
import { get as getPageSize } from 'utils/pageSize';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'REPORT_PAYMENT';
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const GET_REPORTS = `${PRE_FIX}GET_REPORTS`;
export const UPDATE_TIME_LINE = `${PRE_FIX}UPDATE_TIME_LINE`;
export const UPDATE_PAGE_INFO = `${PRE_FIX}UPDATE_PAGE_INFO`;
export const GET_REFRESH_REPORTS = `${PRE_FIX}GET_REFRESH_REPORTS`;
export const UPDATE_BILL_REFUND_VIEW = `${PRE_FIX}UPDATE_BILL_REFUND_VIEW`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

const REPORT_PAYMENT_PAGE_SIZE_KEY = 'REPORT_PAYMENT_PAGE_SIZE_KEY';
export const modifyParams = createAction(
  MODIFY_PARAMS,
  (options = {}, currentParams) => dispatch => {
    const inertKeys = ['fuzzyItem', 'fuzzyVal'];
    const unClearPageKeys = ['fuzzyItem', 'fuzzyVal', 'pageInfo'];
    const clearSortKeys = ['searchDateRange', 'timeUnit', 'type'];
    let result = { ...currentParams };
    let isUpdateBillRefundView = false;
    for (let key in options) {
      let params = {};
      const value = options[key];
      if (key === 'searchDateRange') {
        const { startDate, endDate } = formatDateRangeByTimeUnit(
          value,
          currentParams.timeUnit
        );
        params = {
          startDate,
          endDate
        };
      } else if (key === 'timeUnit') {
        const { startDate, endDate } = formatDateRangeByTimeUnit(
          DEFAULT_DATE_RANGE,
          value
        );
        params = {
          timeUnit: value,
          startDate,
          endDate
        };
      } else if (key === 'pageInfo') {
        const { pageNo, pageSize } = value;
        params = {
          currentPage: pageNo,
          pageSize
        };
      } else if (key === 'type' && value === 'income') {
        params = {
          type: value,
          product: ''
        };
      } else if (key !== 'triggerFuzzy') {
        params[key] = value;
      }

      if (!unClearPageKeys.includes(key)) {
        // 清空页数
        params = {
          ...params,
          currentPage: 1
        };
      }

      if (clearSortKeys.includes(key)) {
        //清空排序
        params = {
          ...params,
          sortBy: undefined,
          orderDesc: undefined
        };
      }

      if (
        (key === 'product' && value) ||
        (key === 'type' && value !== 'refund_bill')
      ) {
        isUpdateBillRefundView = true;
      }

      result = { ...result, ...params };
    }

    if (isUpdateBillRefundView) {
      dispatch(updateBillRefundView('MRR'));
    }

    if (Object.keys(options).some(item => !inertKeys.includes(item))) {
      dispatch(getReports(result));
    }

    //dispatch整理后的params
    if (!options.triggerFuzzy) {
      return dispatch({
        type: MODIFY_PARAMS,
        payload: result
      });
    } else {
      return Promise.resolve();
    }
  }
);

export const getRefreshReports = createAction(
  GET_REFRESH_REPORTS,
  params => dispatch => {
    const request = post({
      url: '/v1/customer/stats/stats/refresh'
    }).then(res => {
      if (res.data) {
        dispatch(getReports(params));
      }
      return Promise.resolve(res);
    });
    return dispatch({
      type: GET_REFRESH_REPORTS,
      payload: request
    });
  }
);

export const getReports = createAction(GET_REPORTS, params => dispatch => {
  const {
    filterType,
    fuzzyItem,
    fuzzyVal,
    pageSize = 20,
    currentPage = 1,
    startDate,
    endDate,
    sortBy,
    orderDesc,
    customerState,
    enabled = true,
    type,
    timeUnit,
    product
  } = params;
  const request = post({
    url: '/v1/customer/stats/pay/chart',
    data: {
      filterType,
      fuzzyItem,
      fuzzyVal,
      pageSize,
      currentPage,
      searchStart: startDate,
      searchEnd: endDate,
      sortBy,
      orderDesc,
      customerState: customerState ? customerState : undefined,
      enabled,
      dataType: type,
      dimension: timeUnit,
      productId: product
    }
  }).then(res => {
    if (!res.result) {
      // dispatch(updatePageInfo({ currentPage: pager, total, pageSize: size }));
    } else {
      const { pager, size, total } = res.data;
      dispatch(updatePageInfo({ pageNo: pager, total, pageSize: size }));
    }
    return Promise.resolve(res);
  });
  dispatch(updateTimeLine(params));
  return dispatch({
    type: GET_REPORTS,
    payload: request
  });
});

export const updatePageInfo = createAction(UPDATE_PAGE_INFO, params => params);

export const updateTimeLine = createAction(
  UPDATE_TIME_LINE,
  ({ startDate, endDate, timeUnit }) => {
    return formatTimeLine(startDate, endDate, timeUnit);
  }
);

export const updateBillRefundView = createAction(
  UPDATE_BILL_REFUND_VIEW,
  viewType => viewType
);
