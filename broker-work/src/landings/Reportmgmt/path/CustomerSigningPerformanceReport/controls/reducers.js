import { handleActions } from 'redux-actions';
import i18n from 'utils/i18n';
import moment from 'moment';
import { dateRange, dateTimeFormatStyle } from 'utils/config';
import { get as getPageSize, set as setPageSize } from 'utils/pageSize';
import { GET_CURRENT_USER_RIGHT } from 'commonActions/actions';
import {
  GET_CUSTOMER_SIGNING_LIST,
  MODIFY_PARAMS,
  UPDATE_SEARCH_TYPE,
  GET_CUSTOMER_SIGNING_DETAIL_LIST,
  MODIFY_INNER_PARAMS
} from './actions';

import {
  ACTION_BAR_SEARCH_TYPE,
  CUSTOMER_SIGNING_TYPE,
  PAYMENT_STATUS,
  PAYMENT_TIME_OPTIONS,
  PAYMENT_SEARCH_OPTIONS
} from '../constant';
export const customerSigningSizeKey = 'customer_signing_report_list';
export const customerSigningInnerSizeKey = 'customer_signing_inner_report_list';
export const customerSigningDetailSizeKey =
  'customer_signing_report_detail_list';
export const customer_signing_list = handleActions(
  {
    [GET_CUSTOMER_SIGNING_LIST]: (state, { type, payload }) => {
      const size = payload.size;
      if (size && getPageSize(customerSigningSizeKey) !== size) {
        setPageSize(customerSigningSizeKey, size);
      }
      return payload;
    }
  },
  {}
);

export const customer_signing_detail_list = handleActions(
  {
    [GET_CUSTOMER_SIGNING_DETAIL_LIST]: (state, { type, payload }) => {
      const size = payload.size;
      if (size && getPageSize(customerSigningDetailSizeKey) !== size) {
        setPageSize(customerSigningDetailSizeKey, size);
      }
      return payload;
    }
  },
  {}
);

export const params = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => (payload ? payload : state),
    // 得到权限后更新初始化选择数据
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      const __arr = getParsedSearchTypes(payload);
      return {
        ...state,
        filterType: __arr[0]
      };
    }
  },
  {
    customerState: CUSTOMER_SIGNING_TYPE[0],
    payState: PAYMENT_STATUS[0],
    filterType: {},
    currentPage: 1,
    pageSize: getPageSize(customerSigningSizeKey),
    searchStart: moment(dateRange.all.start).format(dateTimeFormatStyle),
    searchEnd: moment(dateRange.all.end).format(dateTimeFormatStyle),
    searchDate: PAYMENT_TIME_OPTIONS[0],
    fuzzyVal: '',
    fuzzyItem: PAYMENT_SEARCH_OPTIONS[0],
    orderDesc: true,
    sortBy: 'firstPayTime'
  }
);

export const innerParams = handleActions(
  {
    [MODIFY_INNER_PARAMS]: (state, { payload }) => (payload ? payload : state)
    // 得到权限后更新初始化选择数据
  },
  {
    customerId: '',
    sortBy: 'createTime',
    orderDesc: true,
    currentPage: 1,
    pageSize: getPageSize(customerSigningInnerSizeKey)
  }
);

function getParsedSearchTypes(userRight) {
  let hasAll = false;
  let allItem;
  const parsed = ACTION_BAR_SEARCH_TYPE.concat().filter(item => {
    if (!item.right) return true;
    if (!allItem && item.value === 'all') allItem = item;
    if (!hasAll && userRight[item.right] && item.value === 'all') hasAll = true;
    return userRight[item.right];
  });
  if (parsed.length > 1 && !hasAll) {
    const _allType = ACTION_BAR_SEARCH_TYPE.concat().find(
      item => item.value === 'all'
    );
    parsed.unshift(_allType);
  }
  return parsed;
}

export const searchTypes = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) =>
      getParsedSearchTypes(payload)
  },
  []
);
