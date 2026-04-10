import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import { get as getPageSize } from 'utils/pageSize';
import i18n from 'utils/i18n';

import {
  PRIVILEGE_TYPE,
  STATISTICAL_REPORT_TYPE,
  COMMISSION_REPORT_TYPE,
  OUTSTANDING_REPORT_TYPE
} from '../constant';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'REPORT_';
export const GET_SERVER_LIST = `${PRE_FIX}GET_SERVER_LIST`;
export const UPDATE_CURRENT_SERVER = `${PRE_FIX}UPDATE_CURRENT_SERVER`;
export const GET_PRIVILEGE_TYPE = `${PRE_FIX}GET_PRIVILEGE_TYPE`;
export const UPDATE_CURRENT_PRIVILEGE_TYPE = `${PRE_FIX}UPDATE_CURRENT_PRIVILEGE_TYPE`;
export const GET_STATISTICAL_REPORT_TYPE = `${PRE_FIX}GET_STATISTICAL_REPORT_TYPE`;
export const UPDATE_CURRENT_STATISTICAL_REPROT_TYPE = `${PRE_FIX}UPDATE_CURRENT_STATISTICAL_REPROT_TYPE`;
export const UPDATE_STATISTICAL_LIST_COLUMNS = `${PRE_FIX}UPDATE_STATISTICAL_LIST_COLUMNS`;
export const GET_REPORT_LIST = `${PRE_FIX}GET_REPORT_LIST`;
export const GET_SEARCH_TYPE = `${PRE_FIX}GET_SEARCH_TYPE`;
export const UPDATE_DATE_RANGE = `${PRE_FIX}UPDATE_DATE_RANGE`;
export const UPDATE_SEARCH_TYPE = `${PRE_FIX}UPDATE_SEARCH_TYPE`;
export const UPDATE_SEARCH_TEXT = `${PRE_FIX}UPDATE_SEARCH_TEXT`;
export const UPDATE_NEED_REFRESH = `${PRE_FIX}UPDATE_NEED_REFRESH`;
export const GET_DOWNLOAD_LINK = `${PRE_FIX}GET_DOWNLOAD_LINK`;
export const GET_COMMISSION_REPORT_TYPE = `${PRE_FIX}GET_COMMISSION_REPORT_TYPE`;
export const UPDATE_CURRENT_COMMISSION_REPROT_TYPE = `${PRE_FIX}UPDATE_CURRENT_COMMISSION_REPROT_TYPE`;
export const GET_COMMISSION_REPORT_LIST = `${PRE_FIX}GET_COMMISSION_REPORT_LIST`;
export const UPDATE_COMMISSION_LIST_COLUMNS = `${PRE_FIX}UPDATE_COMMISSION_LIST_COLUMNS`;
export const UPDATE_CURRENT_OBJECT_TYPE = `${PRE_FIX}UPDATE_CURRENT_OBJECT_TYPE`;
export const GET_OBJECT_TYPE = `${PRE_FIX}GET_OBJECT_TYPE`;
export const UPDATE_DETAIL_LIST_COLUMNS = `${PRE_FIX}UPDATE_DETAIL_LIST_COLUMNS`;
export const GET_DETAIL_LIST = `${PRE_FIX}GET_DETAIL_LIST`;
export const RETRY = `${PRE_FIX}RETRY`;
export const RETRY_RT = `${PRE_FIX}RETRY_RT`;
export const UPDATE_CURRENT_COMMISSION_FLAG = `${PRE_FIX}UPDATE_CURRENT_COMMISSION_FLAG`;
export const GET_FLAG = `${PRE_FIX}GET_FLAG`;
export const GET_SYMBOL_GROUP = `${PRE_FIX}GET_SYMBOL_GROUP`;
export const UPDATE_CURRENT_SYMBOL_TYPE = `${PRE_FIX}UPDATE_CURRENT_SYMBOL_TYPE`;
export const UPDATE_CURRENT_SYMBOL_ID = `${PRE_FIX}UPDATE_CURRENT_SYMBOL_ID`;
export const GET_USER_SUB_LEVEL_USERS = `${PRE_FIX}GET_USER_SUB_LEVEL_USERS`;
export const UPDATE_CURRENT_STATISTICAL_SUB_BELONG = `${PRE_FIX}UPDATE_CURRENT_STATISTICAL_SUB_BELONG`;
export const UPDATE_CURRENT_COMMISSION_SUB_BELONG = `${PRE_FIX}UPDATE_CURRENT_COMMISSION_SUB_BELONG`;
export const GET_DETAIL_TYPE = `${PRE_FIX}GET_DETAIL_TYPE`;
export const UPDATE_CURRENT_SORT_PARAM = `${PRE_FIX}UPDATE_CURRENT_SORT_PARAM`;
export const UPDATE_DETAIL_LIST_LOGIN = `${PRE_FIX}UPDATE_DETAIL_LIST_LOGIN`;
export const GET_INNER_DETAIL_LIST = `${PRE_FIX}GET_INNER_DETAIL_LIST`;
export const UPDATE_PAGINATION = `${PRE_FIX}UPDATE_PAGINATION`;
export const GET_DOWNLOAD_LIST = `${PRE_FIX}GET_DOWNLOAD_LIST`;
export const REBUILD_DOWNLOAD = `${PRE_FIX}REBUILD_DOWNLOAD`;
export const CHECK_DOWNLOAD = `${PRE_FIX}CHECK_DOWNLOAD`;
export const POST_DOWNLOAD_REQUEST = `${PRE_FIX}POST_DOWNLOAD_REQUEST`;
export const RETRY_DEPOSIT_TYPE = `${PRE_FIX}RETRY_DEPOSIT_TYPE`;
export const SHOW_RETRY_DEPOSIT_BUTTON = `${PRE_FIX}SHOW_RETRY_DEPOSIT_BUTTON`;
export const GET_DEPOSIT_FAIL_RECORD = `${PRE_FIX}SHOW_RETRY_DEPOSIT_BUTTON`;
export const UPDATE_SELECTED_DEPOSIT = `${PRE_FIX}UPDATE_SELECTED_DEPOSIT`;
export const GET_FAIL_DEPOSIT_COUNT = `${PRE_FIX}GET_FAIL_DEPOSIT_COUNT`;
export const SELECTED_DEPOSIT_RETRY = `${PRE_FIX}SELECTED_DEPOSIT_RETRY`;
export const UPDATE_ADVANCED_LOGIC_TYPE = `${PRE_FIX}UPDATE_ADVANCED_LOGIC_TYPE`;
export const UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS = `${PRE_FIX}UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS`;
export const UPDATE_FIELD_CONDITIONS = `${PRE_FIX}UPDATE_FIELD_CONDITIONS`;
export const GET_MT_GROUP_LIST = `${PRE_FIX}GET_MT_GROUP_LIST`;
export const GET_USER_GROUP_LIST = `${PRE_FIX}GET_USER_GROUP_LIST`;
export const GET_SEARCH_FIELD = `${PRE_FIX}GET_SEARCH_FIELD`;
export const GET_SERVER_SYMBOLS = `${PRE_FIX}GET_SERVER_SYMBOLS`;
export const RESET_SEARCH_OPTIONS = `${PRE_FIX}RESET_SEARCH_OPTIONS`;
export const GET_USER_LEVEL = `${PRE_FIX}GET_USER_LEVEL`;
export const UPDATE_CURRENT_LEVEL = `${PRE_FIX}UPDATE_CURRENT_LEVEL`;
export const GET_OUTSTANDINGL_REPORT_TYPE = `${PRE_FIX}GET_OUTSTANDINGL_REPORT_TYPE`;
export const UPDATE_CURRENT_OUTSTANDING_REPROT_TYPE = `${PRE_FIX}UPDATE_CURRENT_OUTSTANDING_REPROT_TYPE`;
export const UPDATE_OUTSTANDING_LIST_COLUMNS = `${PRE_FIX}UPDATE_OUTSTANDING_LIST_COLUMNS`;
export const UPDATE_CURRENT_OUTSTANDING_TYPE = `${PRE_FIX}UPDATE_CURRENT_OUTSTANDING_TYPE`;
export const GET_OUTSTANDING_REPORT_LIST = `${PRE_FIX}GET_OUTSTANDING_REPORT_LIST`;
export const UPDATE_CURRENT_OUTSTANDING_SUBBELONG = `${PRE_FIX}UPDATE_CURRENT_OUTSTANDING_SUBBELONG`;
export const UPDATE_CURRENT_OUTSTANDING_PRIVILEGE_TYPE = `${PRE_FIX}UPDATE_CURRENT_OUTSTANDING_PRIVILEGE_TYPE`;
export const UPDATE_GROUP = `${PRE_FIX}UPDATE_GROUP`;
export const NOTICE_DONE = `${PRE_FIX}NOTICE_DONE`;

export const UPDATE_CURRENT_RETRY_SEARCH_TYPE = `${PRE_FIX}UPDATE_CURRENT_RETRY_SEARCH_TYPE`;
export const UPDATE_CURRENT_RETRY_SEARCH_TEXT = `${PRE_FIX}UPDATE_CURRENT_RETRY_SEARCH_TEXT`;
export const UPDATE_CONDITION = `${PRE_FIX}UPDATE_CONDITION`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const commissionPpageSizeKey = 'commission_report_list';
export const outstandingSizeKey = 'outstanding_report_list';

//更新详细的detailtype
export const getDetailType = createAction(GET_DETAIL_TYPE, type => type);

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

// 获取账户归属类型
export const getPrivilegeType = createAction(
  GET_PRIVILEGE_TYPE,
  () => PRIVILEGE_TYPE
);

// 更新当前账户归属类型
export const updateCurrentPrivilegeType = createAction(
  UPDATE_CURRENT_PRIVILEGE_TYPE,
  type => type
);

// 更新当前用户树筛选直属信息类型
export const updateCurrentStatisticalSubBelong = createAction(
  UPDATE_CURRENT_STATISTICAL_SUB_BELONG,
  type => type
);

//获取账户列表类型
export const getStatisticalReportType = createAction(
  GET_STATISTICAL_REPORT_TYPE,
  () => STATISTICAL_REPORT_TYPE
);

// 更新当前账户报表类型
export const updateCurrentStatisticalReportType = createAction(
  UPDATE_CURRENT_STATISTICAL_REPROT_TYPE,
  type => {
    return type;
  }
);

//更新账户报表表头
export const updateStatisticalListColumns = createAction(
  UPDATE_STATISTICAL_LIST_COLUMNS,
  columns => columns
);

//获取下载链接
export const getDownLoadLink = createAction(
  GET_DOWNLOAD_LINK,
  ({
    accountQueryItem = 'AccountName',
    objectType = 'all',
    reportType = 'AccountSummary',
    accountQueryValue = '',
    nowPage = 1,
    pageSize = 10,
    searchStart = null,
    searchEnd = null,
    serverId = '',
    format = ''
  }) =>
    get({
      url: '/v1/report/sta/download',
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
        format
      }
    })
);

// 获取账户列表
export const getReportList = createAction(
  GET_REPORT_LIST,
  ({
    accountQueryItem = 'AccountName',
    objectType = 'all',
    reportType = 'AccountSummary',
    accountQueryValue = '',
    nowPage = 1,
    pageSize = getPageSize(accountPageSizeKey),
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
    searchId = ''
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
        searchId
      }
    })
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

//获取到账状态
export const getFlag = createAction(GET_FLAG, flag => flag);

// 更新到账状态
export const updateCurrentFlag = createAction(
  UPDATE_CURRENT_COMMISSION_FLAG,
  flag => flag
);

// 重试实时返佣
export const retryRT = createAction(
  RETRY_RT,
  ({ depositDealId = '', ticketDealId = '' }) =>
    post({
      url: `/v1/report/sta/redeposit/${depositDealId}/${ticketDealId}`
    })
);

// 更新搜索关键词
export const updateSearchText = createAction(UPDATE_SEARCH_TEXT, text => text);

// 更新是否是需要刷新的数据
export const updateNeedRefresh = createAction(
  UPDATE_NEED_REFRESH,
  isNeed => isNeed
);

// 佣金报表部分

export const getCommissionReoprtList = createAction(
  GET_COMMISSION_REPORT_LIST,
  ({
    accountQueryItem = 'AccountName',
    objectType = '',
    reportType = 'Lots',
    accountQueryValue = '',
    nowPage = 1,
    pageSize = getPageSize(commissionPpageSizeKey),
    searchStart = null,
    searchEnd = null,
    serverId = '',
    status = 'all',
    isSubBelong = null,
    userIds = null,
    sortingDirection = '',
    sortingColumn = '',
    sta
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
        status,
        userIds,
        isSubBelong,
        sortingDirection,
        sortingColumn,
        sta
      }
    })
);

//当前返佣对象
export const updateCurrentObjectType = createAction(
  UPDATE_CURRENT_OBJECT_TYPE,
  type => type
);

// 获取账户归属类型
export const getObjectType = createAction(GET_OBJECT_TYPE, type => type);

// 更新当前用户树筛选直属信息类型
export const updateCurrentCommissioSubBelong = createAction(
  UPDATE_CURRENT_COMMISSION_SUB_BELONG,
  type => type
);

//获取佣金报表类型
export const getCommissionReportType = createAction(
  GET_COMMISSION_REPORT_TYPE,
  () => COMMISSION_REPORT_TYPE
);

// 更新当前佣金报表类型
export const updateCurrentCommissionReportType = createAction(
  UPDATE_CURRENT_COMMISSION_REPROT_TYPE,
  type => type
);

//更新佣金报表表头
export const updateCommissionListColumns = createAction(
  UPDATE_COMMISSION_LIST_COLUMNS,
  columns => columns
);

// 更新明细表头
export const updateDetailListColumns = createAction(
  UPDATE_DETAIL_LIST_COLUMNS,
  columns => columns
);

// 更新明细翻页时需要的login
export const updateDetailListLogin = createAction(
  UPDATE_DETAIL_LIST_LOGIN,
  login => login
);

// 获取明细列表
export const getDetailList = createAction(
  GET_DETAIL_LIST,
  ({
    objectType = '',
    reportType = '',
    nowPage = 1,
    pageSize = 20,
    searchStart = null,
    searchEnd = null,
    serverId = '',
    login = '',
    id = '',
    accountQueryItem = '',
    accountQueryValue = ''
  }) =>
    post({
      url: '/v1/report/sta/list',
      data: {
        serverId,
        objectType,
        reportType,
        searchStart,
        searchEnd,
        nowPage,
        pageSize,
        login,
        id,
        accountQueryItem,
        accountQueryValue
      }
    })
);

//重试
export const retry = createAction(RETRY, ({ id = '', serverId = '' }) =>
  post({
    url: `/v1/report/sta/realtime/redo/${serverId}/${id}`
  })
);

//获取品种组列表的下拉项
export const getSymbolGroup = createAction(GET_SYMBOL_GROUP, () =>
  get({ url: '/v2/report/setting/symbolGroup/list' }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const symbolArr = [{ label: i18n['report.all_symbol'], value: '' }];
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

// 更新当前品种
export const updateCurrentSymbolType = createAction(
  UPDATE_CURRENT_SYMBOL_TYPE,
  type => type
);

// 更新当前品种detailId 用于详细modal翻页
export const updateCurrentSymbolId = createAction(
  UPDATE_CURRENT_SYMBOL_ID,
  id => id
);

// 交易返佣报表明细的表中表
export const getInnerDetailList = createAction(
  GET_INNER_DETAIL_LIST,
  ({
    objectType = '',
    reportType = '',
    nowPage = 1,
    pageSize = 20,
    searchStart = null,
    searchEnd = null,
    serverId = '',
    login = '',
    id = '',
    accountQueryItem = '',
    accountQueryValue = ''
  }) =>
    post({
      url: '/v1/report/sta/list',
      data: {
        serverId,
        objectType,
        reportType,
        searchStart,
        searchEnd,
        nowPage,
        pageSize,
        login,
        id,
        accountQueryItem,
        accountQueryValue
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
    url: '/v1/report/sta/download/create',
    data: data
  })
);

export const getDownloadList = createAction(
  GET_DOWNLOAD_LIST,
  ({ pageNo = 1, pageSize = 10 }) =>
    post({
      url: '/v1/report/sta/download/list',
      data: {
        nowPage: pageNo,
        pageSize: pageSize
      }
    })
);

export const rebuildDownload = createAction(REBUILD_DOWNLOAD, id =>
  post({
    url: `/v1/report/sta/download/redo/${id}`
  })
);

export const checkDownload = createAction(CHECK_DOWNLOAD, id =>
  post({
    url: `/v1/report/sta/download/check/${id}`
  })
);

export const saveRetryDepositType = createAction(
  RETRY_DEPOSIT_TYPE,
  type => type
);

export const updateCurrentRetrySearchType = createAction(
  UPDATE_CURRENT_RETRY_SEARCH_TYPE,
  type => type
);

export const updateCurrentRetrySearchText = createAction(
  UPDATE_CURRENT_RETRY_SEARCH_TEXT,
  text => text
);

//批量选中重试入金的订单
export const updateSelectedDeposits = createAction(
  UPDATE_SELECTED_DEPOSIT,
  deposits => deposits
);

//获取失败记录数据数量
export const getFailDepositCount = createAction(
  GET_FAIL_DEPOSIT_COUNT,
  (type, state) =>
    get({
      url:
        type === 'RealTime'
          ? '/v1/report/sta/dayCommission/failCount'
          : '/v1/report/sta/rcrc/failCount',
      data: {
        state: state
      }
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

export const resetSearchOptions = createAction(RESET_SEARCH_OPTIONS);

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

//获取品种列表
export const getServerSymbols = createAction(GET_SERVER_SYMBOLS, () =>
  get({
    url: '/v1/report/setting/serverSymbols'
  })
);

// 业绩报表部分
//获取用户层级
export const getUserLevel = createAction(GET_USER_LEVEL, () =>
  get({
    url: '/v1/level/list/earningReport/byAuthority'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    const __arr = [{ label: i18n['usermgmt.level.all_level'], value: '' }];
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

export const updateCurrentUserLevel = createAction(
  UPDATE_CURRENT_LEVEL,
  level => level
);

//获取业绩列表类型
export const getOutStandingReportType = createAction(
  GET_OUTSTANDINGL_REPORT_TYPE,
  () => OUTSTANDING_REPORT_TYPE
);

export const updateCurrentOutstandingType = createAction(
  UPDATE_CURRENT_OUTSTANDING_TYPE,
  type => type
);

export const updateOutStandingColumns = createAction(
  UPDATE_OUTSTANDING_LIST_COLUMNS,
  columns => columns
);

export const getoutStandingReportList = createAction(
  GET_OUTSTANDING_REPORT_LIST,
  ({
    objectType = 'all',
    reportType = 'UserEarning',
    nowPage = 1,
    pageSize = getPageSize(outstandingSizeKey),
    searchStart = null,
    searchEnd = null,
    isSubBelong = null,
    levelId = '',
    sta
  }) =>
    post({
      url: '/v1/report/sta/list',
      data: {
        objectType,
        reportType,
        searchStart,
        searchEnd,
        nowPage,
        pageSize,
        isSubBelong,
        levelId,
        sta
      }
    })
);

export const updateCurrentoutStandingSubBelong = createAction(
  UPDATE_CURRENT_OUTSTANDING_SUBBELONG,
  type => type
);

export const updateCurrentOutStandingPrivilegeType = createAction(
  UPDATE_CURRENT_OUTSTANDING_PRIVILEGE_TYPE,
  type => type
);

export const noticeDone = createAction(NOTICE_DONE, data => data);
export const updateCondition = createAction(
  UPDATE_CONDITION,
  condition => condition
);
