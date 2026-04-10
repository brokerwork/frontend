import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import i18n from 'utils/i18n';

const PRE_FIX = 'TRASH_';
export const GET_CUSTOMERS = `${PRE_FIX}GET_CUSTOMERS`;
export const UPDATE_PAGENATION_INFO = `${PRE_FIX}UPDATE_PAGENATION_INFO`;
export const UPDATE_PAGENATION_TOTAL = `${PRE_FIX}UPDATE_PAGENATION_TOTAL`;
export const UPDATE_STATE_TYPE = `${PRE_FIX}UPDATE_STATE_TYPE`;
export const UPDATE_SEARCH_DATE = `${PRE_FIX}UPDATE_SEARCH_DATE`;
export const UPDATE_DATE_RANGE = `${PRE_FIX}UPDATE_DATE_RANGE`;
export const UPDATE_FUZZY_SEARCH_TYPE = `${PRE_FIX}UPDATE_FUZZY_SEARCH_TYPE`;
export const UPDATE_FUZZY_SEARCH_TEXT = `${PRE_FIX}UPDATE_FUZZY_SEARCH_TEXT`;
export const DO_FUZZY_SEARCH = `${PRE_FIX}DO_FUZZY_SEARCH`;
export const UPDATE_SELECTED_ITEMS = `${PRE_FIX}UPDATE_SELECTED_ITEMS`;
export const DESTROY_CUSTOMER = `${PRE_FIX}DESTROY_CUSTOMER`;
export const RESET_CUSTOMER = `${PRE_FIX}RESET_CUSTOMER`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;

// 获取项目列表
export const getCustomers = createAction(
  GET_CUSTOMERS,
  ({
    // fuzzyItem = 'CustomerId',
    // fuzzyVal,
    pageSize = 10,
    currentPage = 1,
    // searchDate,
    // searchStart,
    // searchEnd,
    sortBy,
    orderDesc,
    // customSource,
    // customerState,
    advanceConditions = [],
    enabled = false
  }) => dispatch => {
    const request = post({
      url: '/v3/custom/profiles/list',
      data: {
        // fuzzyItem,
        // fuzzyVal,
        pageSize,
        currentPage,
        // searchDate,
        // searchStart,
        // searchEnd,
        sortBy,
        orderDesc,
        // customSource,
        // customerState: ['Lost', 'Active'].includes(customerState)
        //   ? ''
        //   : customerState,
        enabled,
        advanceConditions
        // isLost:
        //   customerState === 'Lost'
        //     ? true
        //     : customerState === ''
        //       ? undefined
        //       : false
      }
    }).then(res => {
      if (res.result) {
        const { pager, size, total } = res.data;
        dispatch(updatePaginationTotal(total));
      } else {
        dispatch(
          updatePagination({
            currentPage,
            pageSize
          })
        );
      }
      return Promise.resolve(res);
    });
    dispatch({
      type: GET_CUSTOMERS,
      payload: request
    });
  }
);

export const updatePagination = createAction(
  UPDATE_PAGENATION_INFO,
  ({ currentPage, pageSize }) => ({
    currentPage,
    pageSize
  })
);

export const updatePaginationTotal = createAction(
  UPDATE_PAGENATION_TOTAL,
  total => total
);

export const updateStateType = createAction(UPDATE_STATE_TYPE, data => data);

export const updateSearchDate = createAction(UPDATE_SEARCH_DATE, type => type);

// 更新选择时间
export const updateDateRange = createAction(
  UPDATE_DATE_RANGE,
  ({ startDate, endDate }) => ({ startDate, endDate })
);

export const updateFuzzySearchType = createAction(
  UPDATE_FUZZY_SEARCH_TYPE,
  value => value
);

export const updateFuzzySearchText = createAction(
  UPDATE_FUZZY_SEARCH_TEXT,
  text => text
);
export const doFuzzySearch = createAction(DO_FUZZY_SEARCH, data => data);

export const updateSelectedItems = createAction(
  UPDATE_SELECTED_ITEMS,
  map => map
);

export const destroyCustomer = createAction(DESTROY_CUSTOMER, ({ ids }) =>
  post({
    url: '/v2/custom/profiles/destroy',
    data: { ids }
  })
);

export const resetCustomer = createAction(RESET_CUSTOMER, ({ ids }) =>
  post({
    url: '/v2/custom/profiles/reset',
    data: { ids }
  })
);

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);
