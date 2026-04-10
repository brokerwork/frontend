import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import i18n from 'utils/i18n';

const PRE_FIX = 'DUPLICATE_';
export const GET_DUPLICATE = `${PRE_FIX}GET_DUPLICATE`;
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
export const GET_BIND_USER_ID = `${PRE_FIX}GET_BIND_USER_ID`;
export const GET_USER_INFO = `${PRE_FIX}GET_USER_INFO`;
export const GET_FIELDS = `${PRE_FIX}GET_FIELDS`;
export const SAVE_INFO = `${PRE_FIX}SAVE_INFO`;

// 获取项目列表
// 获取项目列表
export const getDuplicate = createAction(
  GET_DUPLICATE,
  ({ pageSize = 10, currentPage = 1 }) => dispatch => {
    const request = get({
      url: '/v2/custom/duplicateCheck',
      data: {
        pageSize,
        currentPage
      }
    }).then(res => {
      // if (res.result) {
      //   const { pager, size, total } = res.data;
      //   dispatch(updatePaginationTotal(total));
      // } else {
      //   dispatch(
      //     updatePagination({
      //       currentPage,
      //       pageSize
      //     })
      //   );
      // }
      return Promise.resolve(res);
    });
    dispatch({
      type: GET_DUPLICATE,
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
export const getHasBindUsersId = createAction(GET_BIND_USER_ID, data => {
  return post({
    url: '/v3/custom/bind/ta/user',
    data
  });
});
export const getUsersInfo = createAction(GET_USER_INFO, data => {
  return post({
    url: '/v3/custom/profiles/and/account/owner',
    data
  });
});
export const getFields = createAction(GET_FIELDS, data => {
  return get({
    url:
      '/v1/tenants/metadata/form-field/batch?tableName=t_customer_profiles,t_account_profiles,t_account_finacial,t_account_id_info'
  });
});
export const saveMergeInfo = createAction(SAVE_INFO, data => {
  return post({
    url: '/v3/custom/merge/profiles',
    data
  });
});
