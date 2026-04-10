import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { get as getPageSize } from 'utils/pageSize';
import i18n from 'utils/i18n';
import { dateFormatStyle } from 'utils/config';
import moment from 'moment';
import _ from 'lodash';
import { NEW_REPORTTYPE_FILTER } from '../constant';
// ---------------------------------------------
// action typs
// ---------------------------------------------
const PRE_FIX = 'REPORT_STATISTICAL_';
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const UPDATE_CURRENT_SERVER = `${PRE_FIX}UPDATE_CURRENT_SERVER`;
export const GET_REPORT_LIST = `${PRE_FIX}GET_REPORT_LIST`;
export const UPDATE_UPDATE_TIME = `${PRE_FIX}UPDATE_UPDATE_TIME`;
export const MODIFY_PARAMS = `${PRE_FIX}MODIFY_PARAMS`;
export const UPDATE_CURRENT_STATISTICAL_REPROT_TYPE = `${PRE_FIX}UPDATE_CURRENT_STATISTICAL_REPROT_TYPE`;
export const accountPageSizeKey = 'account_report_list';
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const UPDATE_CONDITION = `${PRE_FIX}UPDATE_CONDITION`;
export const POST_DOWNLOAD_REQUEST = `${PRE_FIX}POST_DOWNLOAD_REQUEST`;
export const GET_USER_SUB_LEVEL_USERS = `${PRE_FIX}GET_USER_SUB_LEVEL_USERS`;
export const UPDATE_SEARCH_TEXT = `${PRE_FIX}UPDATE_SEARCH_TEXT`;
export const GET_SERVER_SYMBOLS = `${PRE_FIX}GET_SERVER_SYMBOLS`;
export const GET_SYMBOL_GROUP = `${PRE_FIX}GET_SYMBOL_GROUP`;
export const UPDATE_PAGINATION = `${PRE_FIX}UPDATE_PAGINATION`;
export const UPDATE_CURRENT_SORT_PARAM = `${PRE_FIX}UPDATE_CURRENT_SORT_PARAM`;
export const GET_RESOURCES = `${PRE_FIX}GET_RESOURCES`;
export const UPDATE_DETAIL_LIST_COLUMNS = `${PRE_FIX}UPDATE_DETAIL_LIST_COLUMNS`;
export const UPDATE_CURRENT_SYMBOL_ID = `${PRE_FIX}UPDATE_CURRENT_SYMBOL_ID`;
export const GET_DETAIL_LIST = `${PRE_FIX}GET_DETAIL_LIST`;
export const GET_DETAIL_TYPE = `${PRE_FIX}GET_DETAIL_TYPE`;
export const GET_TREE_SEARCH = `${PRE_FIX}GET_TREE_SEARCH`;
export const GET_SUB_TREE_USERS_BY_ID = `${PRE_FIX}GET_SUB_TREE_USERS_BY_ID`;
import { getUserInfo } from 'utils/userInfo';
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
export const modifyParams = createAction(MODIFY_PARAMS, params => dispatch => {
  dispatch({
    type: MODIFY_PARAMS,
    payload: params
  });
  dispatch(getReportList(params));
});

const newReportTypeMap = {
  HistoryOrder: 'TRADING_HISTORY_REPORT'
};

export const transSearchParamsConfig = Params => {
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
      let cond = item.type.toUpperCase();
      if (item.type === 'equals') {
        cond = 'EQ';
      }
      if (item.type === 'not_equals') {
        cond = 'NEQ';
      }
      if (item.type === 'in') {
        item.value = item.value.split(SPLIT_KEY);
      }
      // 交易返佣报表 LIKE 替换为 REGEX
      if (reportType === 'HistoryOrder' && item.type === 'like') {
        cond = 'REGEX';
      }
      const target = {
        condition: cond,
        field: item.key,
        logicType: 'AND',
        value: item.value
      };
      if (item.hasOwnProperty('originValue')) {
        target.originValue = item.originValue;
      }
      return target;
    });
  return {
    conditions: newConditions,
    keyword: accountQueryValue,
    lang: '',
    pageSize,
    pager: nowPage,
    reportId: '',
    serverId,
    sortingColumn,
    sortingDirection,
    ownerType: type,
    userId: id || userInfo.id
  };
};

// 获取账户列表
export const getReportList = createAction(
  GET_REPORT_LIST,
  params => dispatch => {
    let copyData = _.cloneDeep(params.conditions);
    const formatData = copyData.find(item => item.key === 'filterDate');
    if (formatData) {
      formatData.value = {
        startDate: moment(formatData.value.startDate).format(dateFormatStyle),
        endDate: moment(formatData.value.endDate).format(dateFormatStyle)
      };
    }
    let newParams = Object.assign(params, { conditions: copyData });
    if (newParams.serverId) {
      if (NEW_REPORTTYPE_FILTER.hasOwnProperty(newParams.reportType)) {
        const newReportType = NEW_REPORTTYPE_FILTER[newParams.reportType];
        const transData = transSearchParamsConfig(newParams);
        dispatch({
          type: GET_REPORT_LIST,
          payload: post({
            url: `/v3/report/list/${newReportType}`,
            data: _.cloneDeep(transData)
          }).then(res => {
            if (res.result && res.data && res.data.list) {
              dispatch(updateUpdateTime(res.time));
            }
            return Promise.resolve(res);
          })
        });
      } else {
        dispatch({
          type: GET_REPORT_LIST,
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
    } else {
      return Promise.resolve({
        result: true,
        data: []
      });
    }
  }
);
// 更新当前账户报表类型
export const updateCurrentStatisticalReportType = createAction(
  UPDATE_CURRENT_STATISTICAL_REPROT_TYPE,
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

// 获取用户下级
export const getReportSubLevelUsers = createAction(
  GET_USER_SUB_LEVEL_USERS,
  v =>
    get({
      url: '/v1/user/tree/child',
      data: {
        userId: v ? v : '',
        module: 'AccountReport'
      }
    })
);
//提交下载请求
export const postDownloadRequest = createAction(
  POST_DOWNLOAD_REQUEST,
  (data, reportType) => {
    const newReportType = NEW_REPORTTYPE_FILTER[reportType];
    const transData = transSearchParamsConfig(data);
    if (newReportType) {
      return post({
        url: `/v3/report/download/create/${newReportType}`,
        data: transData
      });
    }
    return post({
      url: '/v2/report/sta/download/create',
      data: data
    });
  }
);

//获取品种列表
export const getServerSymbols = createAction(GET_SERVER_SYMBOLS, () =>
  get({
    url: '/v1/report/setting/serverSymbols'
  })
);

//获取品种组列表的下拉项
export const getSymbolGroup = createAction(GET_SYMBOL_GROUP, () =>
  get({ url: '/v2/report/setting/symbolGroup/list' }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const symbolArr = [];
    res.data.forEach(item => {
      symbolArr.push({
        label: item.name,
        value: item.id
      });
    });

    return Promise.resolve({
      ...res,
      data: { symbolArr }
    });
  })
);
// 更新当前分页状态
export const updatePagination = createAction(
  UPDATE_PAGINATION,
  ({ pager, pageSize }) => ({ pager, pageSize })
);
// 更新搜索关键词
export const updateSearchText = createAction(UPDATE_SEARCH_TEXT, text => text);

export const updateUpdateTime = createAction(UPDATE_UPDATE_TIME, time => time);

// 更新当前排序字段和升降序类型
export const updateCurrentSortParam = createAction(
  UPDATE_CURRENT_SORT_PARAM,
  param => param
);

export const getResources = createAction(GET_RESOURCES, ({ vendor, value }) =>
  get({
    url: '/v1/account/dropdown/resource',
    header: {
      'x-api-vendor': vendor,
      'x-api-serverid': value
    }
  }).then(res => {
    if (!res.result) return Promise.resolve(res);

    return {
      ...res,
      data: {
        ...res.data,
        vendor
      }
    };
  })
);

// 更新明细表头
export const updateDetailListColumns = createAction(
  UPDATE_DETAIL_LIST_COLUMNS,
  columns => columns
);

// 更新当前品种detailId 用于详细modal翻页
export const updateCurrentSymbolId = createAction(
  UPDATE_CURRENT_SYMBOL_ID,
  id => id
);

// 获取明细列表
export const getDetailList = createAction(GET_DETAIL_LIST, params =>
  post({
    url: '/v2/report/sta/list',
    data: params
  })
);

//更新详细的detailtype
export const getDetailType = createAction(GET_DETAIL_TYPE, type => type);

// 搜索用户下级
export const getTreeSearch = createAction(GET_TREE_SEARCH, v =>
  get({
    url: '/v2/user/search',
    data: {
      value: v ? v : '',
      module: 'AccountReport',
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
      module: 'AccountReport'
    }
  })
);
