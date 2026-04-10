import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { get as getPageSize } from 'utils/pageSize';
import i18n from 'utils/i18n';
import _ from 'lodash';
import moment from 'moment';
import { dateFormatStyle } from 'utils/config';

// ---------------------------------------------
// action typs
// ---------------------------------------------
const PRE_FIX = 'REPORT_OUTSTANDING_';
export const GET_USER_LEVEL = `${PRE_FIX}GET_USER_LEVEL`;
export const POST_DOWNLOAD_REQUEST = `${PRE_FIX}POST_DOWNLOAD_REQUEST`;
export const GET_USER_SUB_LEVEL_USERS = `${PRE_FIX}GET_USER_SUB_LEVEL_USERS`;
export const GET_OUTSTANDING_REPORT_LIST = `${PRE_FIX}GET_OUTSTANDING_REPORT_LIST`;
export const outstandingSizeKey = 'outstanding_report_list';
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const UPDATE_PAGINATION = `${PRE_FIX}UPDATE_PAGINATION`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
export const GET_TREE_SEARCH = `${PRE_FIX}GET_TREE_SEARCH`;
export const GET_SUB_TREE_USERS_BY_ID = `${PRE_FIX}GET_SUB_TREE_USERS_BY_ID`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 业绩报表部分
//获取用户层级
export const getUserLevel = createAction(GET_USER_LEVEL, () =>
  get({
    url: '/v1/level/list/earningReport/byAuthority'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const __arr = [{ label: i18n['usermgmt.level.all_level'], value: 'all' }];
    res.data.forEach(item => {
      __arr.push({
        value: item.id,
        label: item.name
      });
    });
    return Promise.resolve({
      ...res,
      data: __arr
    });
  })
);

//提交下载请求
export const postDownloadRequest = createAction(POST_DOWNLOAD_REQUEST, data =>
  post({
    url: '/v2/report/sta/download/create',
    data: data
  })
);

//业绩报表用户树接口
export const getEarningSubLevelUsers = createAction(
  GET_USER_SUB_LEVEL_USERS,
  v =>
    get({
      url: '/v1/user/tree/child',
      data: {
        userId: v ? v : '',
        module: 'EarningReport'
      }
    })
);

export const getoutStandingReportList = createAction(
  GET_OUTSTANDING_REPORT_LIST,
  params => dispatch => {
    let copyData = _.cloneDeep(params.conditions);
    const formatData = copyData.find(item => item.key === 'filterDate');
    const straight = copyData.find(item => item.key === 'isSubBelong');
    if (formatData) {
      formatData.value = {
        startDate: moment(formatData.value.startDate).format(dateFormatStyle),
        endDate: moment(formatData.value.endDate).format(dateFormatStyle)
      };
    }
    if (straight && typeof straight.value === 'string') {
      straight.value = straight.value === 'straight' ? true : false;
    }
    let newParams = Object.assign(params, { conditions: copyData });
    dispatch({
      type: GET_OUTSTANDING_REPORT_LIST,
      payload: post({
        url: '/v2/report/sta/list',
        data: newParams
      }).then(res => {
        if (res.result && res.data && res.data.list) {
          dispatch(updateUpdateTime(res.time));
        }
        return Promise.resolve(res);
      })
    });
  }
);

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);

// 更新当前分页状态
export const updatePagination = createAction(
  UPDATE_PAGINATION,
  ({ pageNo, pageSize }) => ({ pageNo, pageSize })
);

// 搜索参数修改
export const modifyParams = createAction(MODIFY_PARAMS, params => dispatch => {
  dispatch({
    type: MODIFY_PARAMS,
    payload: params
  });
  dispatch(getoutStandingReportList(params));
});

export const updateUpdateTime = createAction(UPDATE_UPDATE_TIME, time => time);

// 搜索用户下级
export const getTreeSearch = createAction(GET_TREE_SEARCH, v =>
  get({
    url: '/v2/user/search',
    data: {
      value: v ? v : '',
      module: 'EarningReport',
      field: ['name', 'entityNo']
    }
  })
);
// 根据用户id获取树形结构
export const getSubTreeUsersById = createAction(GET_SUB_TREE_USERS_BY_ID, v =>
  get({
    url: '/v1/user/tree/search',
    data: {
      userId: v ? v : '',
      module: 'EarningReport'
    }
  })
);
