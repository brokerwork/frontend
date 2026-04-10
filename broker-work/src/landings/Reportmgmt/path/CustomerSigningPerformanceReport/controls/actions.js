import { createAction } from 'redux-actions';
import { post, get } from 'utils/ajax';
import { get as getPageSize } from 'utils/pageSize';
import moment from 'moment';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'CUSTOMER_SIGNING_PERFORMANCE_REPORT_';
export const GET_CUSTOMER_SIGNING_LIST = `${PRE_FIX}GET_CUSTOMER_SIGNING_LIST`;
export const GET_CUSTOMER_SIGNING_DETAIL_LIST = `${PRE_FIX}GET_CUSTOMER_SIGNING_DETAIL_LIST`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const UPDATE_SEARCH_TYPE = `${PRE_FIX}UPDATE_SEARCH_TYPE`;
export const MODIFY_INNER_PARAMS = `${PRE_FIX}MODIFY_INNER_PARAMS`;
export const REFRESH_LIST = `${PRE_FIX}REFRESH_LIST`;
// ---------------------------------------------
// action creaters
// ---------------------------------------------
export const customerSigningSizeKey = 'customer_signing_report_list';
export const customerSigningDetailSizeKey =
  'customer_signing_report_detail_list';
// 获取列表
export const getCustomerSigningList = createAction(
  GET_CUSTOMER_SIGNING_LIST,
  params => dispatch => {
    const __params = { ...params };
    __params['customerState'] = params.customerState.value;
    __params['filterType'] = params.filterType.value;
    __params['payState'] = params.payState.value;
    __params['fuzzyItem'] = params.fuzzyItem.value;
    __params['searchDate'] = params.searchDate.value;
    __params['searchEnd'] = moment(params.searchEnd).format('x');
    __params['searchStart'] = moment(params.searchStart).format('x');
    __params['pageSize'] = params.pageSize;
    dispatch({
      type: GET_CUSTOMER_SIGNING_LIST,
      payload: post({
        url: '/v1/customer/stats/sign/chart',
        data: __params
      }).then(res => {
        return Promise.resolve(res);
      })
    });
  }
);
//获取详情
export const getCustomerSigningDetailList = createAction(
  GET_CUSTOMER_SIGNING_DETAIL_LIST,
  params =>
    post({
      url: '/v1/customer/stats/sign/bill/list',
      data: params
    })
);
// 客户状态
export const modifyParams = createAction(MODIFY_PARAMS, params => dispatch => {
  dispatch({
    type: MODIFY_PARAMS,
    payload: params
  });
  dispatch(getCustomerSigningList(params));
});

export const updateSearchType = createAction(
  UPDATE_SEARCH_TYPE,
  value => value
);

// 客户状态
export const modifyInnerParams = createAction(
  MODIFY_INNER_PARAMS,
  params => params
);

// 更新数据
export const refreshList = createAction(REFRESH_LIST, params =>
  post({
    url: '/v1/customer/stats/stats/refresh'
  })
);
