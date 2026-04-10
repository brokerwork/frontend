import { createAction } from 'redux-actions';
import { post, get } from 'utils/ajax';
import { get as getPageSize } from 'utils/pageSize';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'AGENT_DEPOSIT_REPORT_';
export const GET_AGENT_DEPOSIT_LIST = `${PRE_FIX}GET_AGENT_DEPOSIT_LIST`;
export const UPDATE_PAGINATION = `${PRE_FIX}UPDATE_PAGINATION`;
export const GET_SEARCH_TYPE = `${PRE_FIX}GET_SEARCH_TYPE`;
export const UPDATE_SEARCH_TYPE = `${PRE_FIX}UPDATE_SEARCH_TYPE`;
export const UPDATE_SEARCH_TEXT = `${PRE_FIX}UPDATE_SEARCH_TEXT`;
export const UPDATE_NEED_REFRESH = `${PRE_FIX}UPDATE_NEED_REFRESH`;
export const UPDATE_AGENT_LIST_COLUMNS = `${PRE_FIX}UPDATE_AGENT_LIST_COLUMNS`;
export const UPDATE_DEPOSIT = `${PRE_FIX}UPDATE_DEPOSIT`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------
export const agentdepositSizeKey = 'agentdeposit_report_list';
// 获取列表
export const getAgentDepositList = createAction(
  GET_AGENT_DEPOSIT_LIST,
  ({
    name = '',
    login = '',
    nowPage = 1,
    pageSize = getPageSize(agentdepositSizeKey)
  }) =>
    get({
      url: '/v1/agent/margin/user',
      data: {
        name,
        login,
        nowPage,
        pageSize
      }
    })
);

// 更新当前分页状态
export const updatePagination = createAction(
  UPDATE_PAGINATION,
  ({ pageNo, pageSize }) => ({ pageNo, pageSize })
);

// 更新是否是需要刷新的数据
export const updateNeedRefresh = createAction(
  UPDATE_NEED_REFRESH,
  isNeed => isNeed
);

export const updateAgentDepositColumns = createAction(
  UPDATE_AGENT_LIST_COLUMNS,
  columns => columns
);

//获取搜索类型
export const getSearchType = createAction(GET_SEARCH_TYPE, type => type);

// 更新搜索类型
export const updateSearchType = createAction(UPDATE_SEARCH_TYPE, type => type);

// 更新搜索关键词
export const updateSearchText = createAction(UPDATE_SEARCH_TEXT, text => text);

// 入金处理
export const updateDeposit = createAction(
  UPDATE_DEPOSIT,
  (data, vendor, serverId) =>
    post({
      url: '/v1/account/manage/deposit',
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      },
      data: data
    })
);
