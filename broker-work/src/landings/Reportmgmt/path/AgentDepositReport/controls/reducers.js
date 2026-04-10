import { handleActions } from 'redux-actions';
import i18n from 'utils/i18n';
import {
  GET_AGENT_DEPOSIT_LIST,
  UPDATE_PAGINATION,
  GET_SEARCH_TYPE,
  UPDATE_SEARCH_TYPE,
  UPDATE_SEARCH_TEXT,
  RESET_SEARCH_OPTIONS,
  UPDATE_NEED_REFRESH,
  UPDATE_AGENT_LIST_COLUMNS
} from './actions';
import { get as getPageSize, set as setPageSize } from 'utils/pageSize';
export const agentdepositSizeKey = 'agentdeposit_report_list';
export const report_list = handleActions(
  {
    [GET_AGENT_DEPOSIT_LIST]: (state, { type, payload }) => {
      const size = payload.size;
      if (size && getPageSize(agentdepositSizeKey) !== size) {
        setPageSize(agentdepositSizeKey, size);
      }
      return payload;
    }
  },
  {}
);

export const current_pagination = handleActions(
  {
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);

      if (payload['pageSize'] && getPageSize() !== size) {
        setPageSize(size);
      }

      return payload;
    }
  },
  { pageNo: 1, pageSize: getPageSize() }
);
//整理搜索字段
const parseSearchData = searchtype => {
  const copyData = searchtype.concat();
  return copyData;
};
//搜索类型
export const account_query_item = handleActions(
  {
    [GET_SEARCH_TYPE]: (state, { type, payload }) =>
      parseSearchData(payload)[0],
    [UPDATE_SEARCH_TYPE]: (state, { type, payload }) => payload
  },
  {}
);

//搜索类型
export const search_type = handleActions(
  {
    [GET_SEARCH_TYPE]: (state, { type, payload }) => payload
  },
  []
);

//搜索内容
export const account_query_value = handleActions(
  {
    [UPDATE_SEARCH_TEXT]: (state, { type, payload }) => payload,
    [RESET_SEARCH_OPTIONS]: (state, { type, payload }) => {
      return '';
    }
  },
  ''
);

//是否应该刷新数据
export const current_need_refresh = handleActions(
  {
    [UPDATE_NEED_REFRESH]: (state, { type, payload }) => payload
  },
  i18n['report.date_range_type.default_tints']
);

export const agentDepositListcolumns = handleActions(
  {
    [UPDATE_AGENT_LIST_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);
