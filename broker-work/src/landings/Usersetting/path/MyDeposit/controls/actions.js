import { createAction } from 'redux-actions';
import { post, get } from 'utils/ajax';
import { get as getPageSize } from 'utils/pageSize';

// ---------------------------------------------
// action types
// ---------------------------------------------

const PRE_FIX = 'USER_SETTING_AGENT_';
export const GET_DEPOSIT_DETAIL = `${PRE_FIX}GET_DEPOSIT_DETAIL`;
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const UPDATE_CURRENT_SERVER = `${PRE_FIX}UPDATE_CURRENT_SERVER`;
export const GET_REPORT_LIST = `${PRE_FIX}GET_REPORT_LIST`;
export const GET_PROFIT_LIST = `${PRE_FIX}GET_PROFIT_LIST`;
export const UPDATE_DATE_RANGE = `${PRE_FIX}UPDATE_DATE_RANGE`;
export const UPDATE_SEARCH_TYPE = `${PRE_FIX}UPDATE_SEARCH_TYPE`;
export const UPDATE_SEARCH_TEXT = `${PRE_FIX}UPDATE_SEARCH_TEXT`;
export const UPDATE_NEED_REFRESH = `${PRE_FIX}UPDATE_NEED_REFRESH`;
export const UPDATE_CURRENT_SORT_PARAM = `${PRE_FIX}UPDATE_CURRENT_SORT_PARAM`;
export const GET_SEARCH_TYPE = `${PRE_FIX}GET_SEARCH_TYPE`;
export const RESET_SEARCH_OPTIONS = `${PRE_FIX}RESET_SEARCH_OPTIONS`;
export const UPDATE_PAGINATION = `${PRE_FIX}UPDATE_PAGINATION`;
export const UPDATE_STATUS = `${PRE_FIX}UPDATE_STATUS`;
export const GET_STATUS = `${PRE_FIX}GET_STATUS`;
export const RETRY_PROFIT = `${PRE_FIX}RETRY_PROFIT`;
export const UPDATE_HEADER = `${PRE_FIX}UPDATE_HEADER`;
export const GET_SEARCH_FIELD = `${PRE_FIX}GET_SEARCH_FIELD`;
export const UPDATE_ADVANCED_LOGIC_TYPE = `${PRE_FIX}UPDATE_ADVANCED_LOGIC_TYPE`;
export const UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS = `${PRE_FIX}UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const GET_MT_GROUP_LIST = `${PRE_FIX}GET_MT_GROUP_LIST`;
export const GET_USER_GROUP_LIST = `${PRE_FIX}GET_USER_GROUP_LIST`;
export const UPDATE_CONDITION = `${PRE_FIX}UPDATE_CONDITION`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------
export const agentPageSizeKey = 'agent_report_list';
export const profitPageSizeKey = 'profit_report_list';

export const getDepositByUserId = createAction(GET_DEPOSIT_DETAIL, id =>
  get({
    url: `/v1/agent/margin/user/${id}`
  })
);

export const resetSearchOptions = createAction(RESET_SEARCH_OPTIONS);

// 获取服务器列表
export const getServerList = createAction(GET_SERVER_LIST, () =>
  get({ url: '/v1/account/dropdown/serverList' })
);

// 更新当前服务器
export const updateCurrentServer = createAction(
  UPDATE_CURRENT_SERVER,
  server => server
);

// 更新当前排序字段和升降序类型
export const updateCurrentSortParam = createAction(
  UPDATE_CURRENT_SORT_PARAM,
  param => param
);

// 获取账户列表
export const getReportList = createAction(
  GET_REPORT_LIST,
  ({
    accountQueryItem = 'AccountName',
    objectType = '',
    reportType = '',
    accountQueryValue = '',
    nowPage = 1,
    pageSize = getPageSize(agentPageSizeKey),
    searchStart = null,
    searchEnd = null,
    serverId = '',
    id = '',
    isSubBelong = null,
    sortingDirection = '',
    sortingColumn = '',
    conditions,
    isConditionAnd,
    sta,
    searchId = '',
    isMarginMode = true
  }) =>
    post({
      url: '/v1/report/sta/list',
      data: {
        serverId,
        objectType,
        reportType,
        accountQueryItem,
        accountQueryValue,
        searchStart,
        searchEnd,
        nowPage,
        pageSize,
        id,
        isSubBelong,
        sortingDirection,
        sortingColumn,
        conditions,
        isConditionAnd,
        sta,
        searchId,
        isMarginMode
      }
    })
);
// 获取账户列表
export const getProfitList = createAction(
  GET_PROFIT_LIST,
  ({
    start = null,
    end = null,
    nowPage = 1,
    pageSize = getPageSize(profitPageSizeKey),
    userId = '',
    status = ''
  }) =>
    get({
      url: '/v1/agent/margin/trade',
      data: {
        start,
        end,
        nowPage,
        pageSize,
        userId,
        status
      }
    })
);

// 更新当前分页状态
export const updatePagination = createAction(
  UPDATE_PAGINATION,
  ({ pageNo, pageSize }) => ({ pageNo, pageSize })
);

// 更新选择时间
export const updateDateRange = createAction(
  UPDATE_DATE_RANGE,
  ({ startDate, endDate }) => ({ startDate, endDate })
);

//获取搜索类型
export const getSearchType = createAction(GET_SEARCH_TYPE, type => type);

// 更新搜索类型
export const updateSearchType = createAction(UPDATE_SEARCH_TYPE, type => type);

// 更新搜索关键词
export const updateSearchText = createAction(UPDATE_SEARCH_TEXT, text => text);

// 更新是否是需要刷新的数据
export const updateNeedRefresh = createAction(
  UPDATE_NEED_REFRESH,
  isNeed => isNeed
);

//获取搜索类型
export const getStatus = createAction(GET_STATUS, type => type);

// 更新搜索类型
export const updateStatus = createAction(UPDATE_STATUS, type => type);

// 重新处理失败盈亏明细
export const retryProfit = createAction(RETRY_PROFIT, ids =>
  post({
    url: `/v1/agent/margin/redo/${ids}`
  })
);

// 更新是否是需要刷新的数据
export const updateHeader = createAction(UPDATE_HEADER, header => header);

//帐户报表高级搜索相关

export const updateAdvancedLogicType = createAction(
  UPDATE_ADVANCED_LOGIC_TYPE,
  type => type
);

//更新高级搜索条件总和
export const getSearchField = createAction(
  GET_SEARCH_FIELD,
  columns => columns
);

// 更新高级搜索条件
export const updateSelectedAdvancedSearchConditions = createAction(
  UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS,
  conditions => conditions
);

export const updateFieldConditions = createAction(
  UPDATE_FIELD_CONDITIONS,
  conditions => conditions
);

// 获取MT组列表
export const getMTGroupList = createAction(
  GET_MT_GROUP_LIST,
  ({ vendor, serverId }) =>
    get({
      url: '/v1/account/dropdown/groups',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);

// 获取账户组列表
export const getUserGroupList = createAction(
  GET_USER_GROUP_LIST,
  ({ vendor, serverId }) =>
    get({
      url: '/v1/account/manage/userGroup/info',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    })
);
export const updateCondition = createAction(
  UPDATE_CONDITION,
  condition => condition
);
