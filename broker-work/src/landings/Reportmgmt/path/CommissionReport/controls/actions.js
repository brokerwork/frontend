import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { get as getPageSize } from 'utils/pageSize';
import { dateFormatStyle } from 'utils/config';
import i18n from 'utils/i18n';
import _ from 'lodash';
import moment from 'moment';
import { getUserInfo } from 'utils/userInfo';
import { NEW_REPORTTYPE_FILTER } from '../constants';
// ---------------------------------------------
// action typs
// ---------------------------------------------
const PRE_FIX = 'REPORT_COMMISSION_';
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const UPDATE_CURRENT_SERVER = `${PRE_FIX}UPDATE_CURRENT_SERVER`;
export const GET_REPORT_LIST = `${PRE_FIX}GET_REPORT_LIST`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const UPDATE_CURRENT_COMMISSION_REPROT_TYPE = `${PRE_FIX}UPDATE_CURRENT_COMMISSION_REPROT_TYPE`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const UPDATE_CONDITION = `${PRE_FIX}UPDATE_CONDITION`;
export const POST_DOWNLOAD_REQUEST = `${PRE_FIX}POST_DOWNLOAD_REQUEST`;
export const GET_USER_SUB_LEVEL_USERS = `${PRE_FIX}GET_USER_SUB_LEVEL_USERS`;
export const UPDATE_SEARCH_TEXT = `${PRE_FIX}UPDATE_SEARCH_TEXT`;
export const commissionPageSizeKey = 'commission_report_list';
export const SELECT_ITEM = `${PRE_FIX}SELECT_ITEM`;
export const SELECTED_DEPOSIT_RETRY = `${PRE_FIX}SELECTED_DEPOSIT_RETRY`;
export const SELECTED_DEPOSIT_DELETE = `${PRE_FIX}SELECTED_DEPOSIT_DELETE`;
export const UPDATE_CURRENT_SORT_PARAM = `${PRE_FIX}UPDATE_CURRENT_SORT_PARAM`;
export const UPDATE_PAGINATION = `${PRE_FIX}UPDATE_PAGINATION`;
export const GET_TREE_SEARCH = `${PRE_FIX}GET_TREE_SEARCH`;
export const GET_SUB_TREE_USERS_BY_ID = `${PRE_FIX}GET_SUB_TREE_USERS_BY_ID`;
export const GET_SIMPLE_USERS = `${PRE_FIX}GET_SIMPLE_USERS`;
export const CHECK_FAIL_NUM = `${PRE_FIX}CHECK_FAIL_NUM`;
export const RECOMPUTED = `${PRE_FIX}RECOMPUTED`;
export const REBATE_SEARCH_DOWNLOAD_REQUEST = `${PRE_FIX}REBATE_SEARCH_DOWNLOAD_REQUEST`;

export const rebateSearchParamsConfig = Params => {
  const newParams = _.cloneDeep(Params);
  const {
    conditions,
    accountQueryValue,
    pageSize,
    nowPage,
    serverId,
    reportType,
    sortingColumn,
    sortingDirection
  } = newParams;
  const SPLIT_KEY = '@#$';
  const objectType = conditions.find(item => item.key === 'objectType');
  const [type, id] = _.get(objectType, 'value', '').split(SPLIT_KEY);
  const userInfo = getUserInfo();
  const newConditions = conditions
    .filter(con => con.key !== 'objectType')
    .map(item => {
      if (item.key === 'filterDate') {
        item.key = 'time';
        item.value = [item.value.startDate, item.value.endDate];
      }
      return {
        condition: item.type.toUpperCase(),
        field: item.key,
        logicType: 'AND',
        value: item.value
      };
    });
  return {
    conditions: newConditions,
    keyword: accountQueryValue,
    lang: '',
    ownerType: reportType === 'LotsNewSearch' ? `sub` : type,
    pageSize,
    pager: nowPage,
    reportId: '',
    serverId,
    sortingColumn,
    sortingDirection,
    userId: id || userInfo.id
  };
};

// 更新当前服务器
export const updateCurrentServer = createAction(
  UPDATE_CURRENT_SERVER,
  server => server
);
// 获取服务器列表
export const getServerList = createAction(GET_SERVER_LIST, () =>
  get({ url: '/v1/account/dropdown/serverList' })
);

// 搜索参数修改
export const modifyParams = createAction(
  MODIFY_PARAMS,
  (params, noUpdate) => dispatch => {
    if (!noUpdate) {
      dispatch({
        type: MODIFY_PARAMS,
        payload: params
      });
    }
    dispatch(getReportList(params, noUpdate));
  }
);

// 获取账户列表
export const getReportList = createAction(
  GET_REPORT_LIST,
  (params, noUpdate) => dispatch => {
    let copyData = _.cloneDeep(params.conditions);
    const formatData = copyData.find(item => item.key === 'filterDate');
    if (formatData) {
      formatData.value = {
        startDate: moment(formatData.value.startDate).format(dateFormatStyle),
        endDate: moment(formatData.value.endDate).format(dateFormatStyle)
      };
    }
    // 特殊处理 在获取返佣报表列表时，若选择是第一次进入页面的用户，conditions 中objectType 的value 需要处理成 sub@#$id 这种格式
    const objectTypeItem = copyData.find(item => item.key === 'objectType');
    const userInfo = getUserInfo();
    if (objectTypeItem && userInfo.id == objectTypeItem.value) {
      objectTypeItem.value = `sub@#$${objectTypeItem.value}`;
    }
    let newParams = _.cloneDeep(
      Object.assign(params, { conditions: copyData })
    );
    let getList = {
      url: '/v2/report/sta/list',
      data: newParams
    };
    // 交易返佣查询报表处理 特殊处理 心情有点复杂，参数结构全部变了
    const newReportType =
      NEW_REPORTTYPE_FILTER[_.get(newParams, 'reportType', '')];
    if (newReportType) {
      // 实时返佣要加上时间
      if (newReportType === 'RCR_REPORT') {
        const filterDate = _.find(newParams.conditions, { key: 'filterDate' });
        if (filterDate && filterDate.value) {
          const dateTimeFormatStyle = 'YYYY-MM-DD HH:mm';
          filterDate.value = {
            startDate: moment(filterDate.originValue.startDate).format(
              dateTimeFormatStyle
            ),
            endDate: moment(filterDate.originValue.endDate).format(
              dateTimeFormatStyle
            )
          };
        }
      }
      const searchParams = rebateSearchParamsConfig(newParams);
      getList = {
        url: `/v3/report/list/${newReportType}`,
        data: searchParams
      };
    }
    return dispatch({
      type: noUpdate ? CHECK_FAIL_NUM : GET_REPORT_LIST, // noUpdate为true表示查询失败数，不更新list
      payload: post(getList).then(res => {
        if (res.result && res.data && res.data.list) {
          dispatch(updateUpdateTime(res.time));
          // 给数据加上id
          res.data.list.forEach((item, index) => {
            item.id = item.id ? item.id : `${new Date().getTime()}${index}`;
          });
        }
        return Promise.resolve(res);
      })
    });
  }
);

// 更新当前账户报表类型
export const updateCurrentCommissionReportType = createAction(
  UPDATE_CURRENT_COMMISSION_REPROT_TYPE,
  type => {
    return type;
  }
);

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);

export const updateCondition = createAction(
  UPDATE_CONDITION,
  condition => condition
);

//选择失败行数
export const selectItem = createAction(SELECT_ITEM, data => data);

// 获取用户下级
export const getComissionSubLevelUsers = createAction(
  GET_USER_SUB_LEVEL_USERS,
  v =>
    get({
      url: '/v1/user/tree/child',
      data: {
        userId: v ? v : '',
        module: 'CommissionReport'
      }
    })
);
// 根据用户id获取树形结构
export const getSubTreeUsersById = createAction(GET_SUB_TREE_USERS_BY_ID, v =>
  get({
    url: '/v1/user/tree/search',
    data: {
      userId: v ? v : '',
      module: 'CommissionReport'
    }
  })
);

// 搜索用户下级
export const getTreeSearch = createAction(GET_TREE_SEARCH, v =>
  get({
    url: '/v2/user/search',
    data: {
      value: v ? v : '',
      module: 'CommissionReport',
      field: ['name', 'entityNo']
    }
  })
);

// 更新当前分页状态
export const updatePagination = createAction(
  UPDATE_PAGINATION,
  ({ pageNo, pageSize }) => ({ pageNo, pageSize })
);

//提交下载请求
export const postDownloadRequest = createAction(POST_DOWNLOAD_REQUEST, data =>
  post({
    url: '/v2/report/sta/download/create',
    data: data
  })
);
//交易返佣查询 下载
export const rebateSearchDownloadRequest = createAction(
  REBATE_SEARCH_DOWNLOAD_REQUEST,
  (data, newReportType) =>
    post({
      url: `/v3/report/download/create/${newReportType}`,
      data: data
    })
);
// 批量重试入金
export const selectedDepositRetry = createAction(
  SELECTED_DEPOSIT_RETRY,
  (type, selectedDeposits) =>
    post({
      url:
        type === 'RealTime'
          ? '/v1/report/sta/dayCommission/redo'
          : '/v1/report/sta/rcrc/redo',
      data: {
        ids: selectedDeposits
      }
    })
);
// 批量删除失败记录
export const selectedDepositDelete = createAction(
  SELECTED_DEPOSIT_DELETE,
  (type, selectedDeposits) =>
    post({
      url:
        type === 'RealTime'
          ? '/v1/report/sta/dayCommission/delete'
          : '/v1/report/sta/rcrc/delete',
      data: {
        ids: selectedDeposits
      }
    })
);

// 更新当前排序字段和升降序类型
export const updateCurrentSortParam = createAction(
  UPDATE_CURRENT_SORT_PARAM,
  param => param
);

// 更新搜索关键词
export const updateSearchText = createAction(UPDATE_SEARCH_TEXT, text => text);

export const updateUpdateTime = createAction(UPDATE_UPDATE_TIME, time => time);

// 获取高级搜索用户列表
export const getSimpleUsers = createAction(
  GET_SIMPLE_USERS,
  name =>
    post({
      url: '/v1/user/simpleUserCommissionRight',
      data: { fuzzyValue: name }
    }),
  () => ({
    noMask: true
  })
);

// 重算交易返佣
export const reComputedRebate = createAction(RECOMPUTED, data => {
  const params = Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .join('&');

  return post({
    url: `/v2/rebate/recalculate?${params}`
  });
});
