import { handleActions } from 'redux-actions';
import _ from 'lodash';
import i18n from 'utils/i18n';
import moment from 'moment';
import { dateRange, dateFormatStyle } from 'utils/config';
import {
  GET_SERVER_LIST,
  UPDATE_CURRENT_SERVER,
  GET_REPORT_LIST,
  UPDATE_UPDATE_TIME,
  UPDATE_CURRENT_STATISTICAL_REPROT_TYPE,
  MODIFY_PARAMS,
  accountPageSizeKey,
  UPDATE_FIELD_CONDITIONS,
  UPDATE_CONDITION,
  UPDATE_SEARCH_TEXT,
  GET_SERVER_SYMBOLS,
  GET_SYMBOL_GROUP,
  UPDATE_PAGINATION,
  UPDATE_CURRENT_SORT_PARAM,
  GET_RESOURCES,
  UPDATE_DETAIL_LIST_COLUMNS,
  GET_DETAIL_LIST,
  UPDATE_CURRENT_SYMBOL_ID,
  GET_DETAIL_TYPE
} from './actions';
import { get as getPageSize, set as setPageSize } from 'utils/pageSize';
import { GET_CURRENT_USER_RIGHT, GET_USER_INFO } from 'commonActions/actions';
import {
  PRIVILEGE_TYPE,
  STATISTICAL_REPORT_TYPE,
  ADVANCED_SEARCH_CONDITIONS
} from '../../../constant.js';
import TableType, {
  ACCOUNTSUMMARY_HEADER,
  ACCOUNTDW_HEADER,
  POSITION_HEADER,
  ORDER_HEADER,
  HISTORYORDER_HEADER,
  STOPLIMIT_HEADER,
  SYMBOLGROUP_HEADER,
  NEWUSER_HEADER
} from '../constant';
import { getUserInfo } from 'utils/userInfo';

//组合所属服务器信息
const parseServerListData = serverList => {
  const copyData = serverList.concat();

  return copyData.map(server => {
    return {
      label: server.desc,
      value: server.serverId,
      vendor: server.vendor
    };
  });
};

//服务器列表
export const server_list = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) =>
      parseServerListData(payload)
  },
  []
);
//更新当前所属服务器
export const current_server = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) =>
      parseServerListData(payload)[0],
    [UPDATE_CURRENT_SERVER]: (state, { type, payload }) => {
      return payload;
    }
  },
  {}
);

// 更新账户列表数据
export const report_list = handleActions(
  {
    [GET_REPORT_LIST]: (state, { type, payload }) => {
      const size = payload.size;
      if (size && getPageSize(accountPageSizeKey) !== size) {
        setPageSize(accountPageSizeKey, size);
      }
      return payload;
    }
  },
  {}
);
//账户归属类型
export const privilege_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const parsed = PRIVILEGE_TYPE.concat().filter(
        item => payload[item.right]
      );
      const allType = parsed.find(item => item.value === 'all');

      if (parsed.length > 1 && !allType) {
        const _allType = PRIVILEGE_TYPE.concat().find(
          item => item.value === 'all'
        );
        parsed.push(_allType);
      }

      return parsed;
    }
  },
  []
);

// 列表更新时间
export const listUpdateTime = handleActions(
  {
    [UPDATE_UPDATE_TIME]: (state, { payload }) => payload
  },
  ''
);
// 左侧筛选条件
export const advancedSearchType = handleActions(
  {
    [UPDATE_CURRENT_STATISTICAL_REPROT_TYPE]: (state, { payload }) => {
      const types = `${payload.toUpperCase()}_ADVANCED_SEARCH_TYPE`;

      return TableType[types];
    },
    [GET_RESOURCES]: (state, { type, payload }) => {
      let copyed = _.cloneDeep(state);
      const { mtGroup = [], accountGroup = [] } = payload;
      const list = {
        group: mtGroup,
        account_group: accountGroup
      };

      copyed = copyed.map(item => {
        return {
          ...item,
          optionList: list[item.value] || item.optionList
        };
      });

      return copyed;
    }
  },
  []
);

//获取列表默认为空
export const statistical_list_columns = handleActions(
  {
    [UPDATE_CURRENT_STATISTICAL_REPROT_TYPE]: (state, { type, payload }) => {
      let reportNewHeader = [];
      switch (payload) {
        case 'AccountSummary':
          reportNewHeader = ACCOUNTSUMMARY_HEADER;
          break;
        case 'AccountDw':
          reportNewHeader = ACCOUNTDW_HEADER;
          break;
        case 'Position':
          reportNewHeader = POSITION_HEADER;
          break;
        case 'Order':
          reportNewHeader = ORDER_HEADER;
          break;
        case 'HistoryOrder':
          reportNewHeader = HISTORYORDER_HEADER;
          break;
        case 'SymbolGroup':
          reportNewHeader = SYMBOLGROUP_HEADER;
          break;
        case 'StopLimit':
          reportNewHeader = STOPLIMIT_HEADER;
          break;
        case 'NewUser':
          reportNewHeader = NEWUSER_HEADER;
          break;
      }
      return reportNewHeader;
    }
  },
  []
);

export const current_statistical_report_type = handleActions(
  {
    [UPDATE_CURRENT_STATISTICAL_REPROT_TYPE]: (state, { type, payload }) => {
      return STATISTICAL_REPORT_TYPE.find(item => item.value === payload);
    }
  },
  {}
);

const DEFAULT_SEARCH_CONDITIONS = [
  {
    key: 'filterDate',
    type: 'between',
    originValue: {
      startDate: moment(),
      endDate: moment()
    },
    value: {
      startDate: moment(),
      endDate: moment()
    }
  }
];

const DEFAULT_SEARCH_PARAMS = {
  reportType: 'AccountSummary',
  accountQueryValue: '',
  nowPage: 1,
  pageSize: getPageSize(accountPageSizeKey),
  serverId: '',
  sortingDirection: '',
  sortingColumn: '',
  conditions: DEFAULT_SEARCH_CONDITIONS,
  isConditionAnd: true,
  searchId: ''
};

export const searchParams = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => {
      return payload;
    },
    [GET_SERVER_LIST]: (state, { type, payload }) => {
      return {
        ...state,
        serverId: parseServerListData(payload)[0].value
      };
    },
    [UPDATE_CURRENT_SERVER]: (state, { type, payload }) => {
      return {
        ...state,
        serverId: payload.value
      };
    },
    [UPDATE_CURRENT_SORT_PARAM]: (state, { type, payload }) => {
      return {
        ...state,
        sortingColumn: payload.sortby,
        sortingDirection: payload.orderDesc ? 'desc' : 'asc'
      };
    },
    [UPDATE_CURRENT_STATISTICAL_REPROT_TYPE]: (state, { type, payload }) => {
      return {
        ...state,
        reportType: payload
      };
    },
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      let size = Number(payload['pageSize']);
      if (!size && getPageSize(accountPageSizeKey)) {
        size = getPageSize(accountPageSizeKey);
      }
      if (size && getPageSize(accountPageSizeKey) !== size) {
        setPageSize(accountPageSizeKey, size);
      }
      return {
        ...state,
        nowPage: payload['pager'],
        pageSize: size
      };
    },
    [UPDATE_CONDITION]: (state, { type, payload }) => {
      return {
        ...state,
        searchId: payload
      };
    },
    [UPDATE_SEARCH_TEXT]: (state, { type, payload }) => {
      return {
        ...state,
        accountQueryValue: payload
      };
    },
    [UPDATE_FIELD_CONDITIONS]: (state, { type, payload }) => {
      let copyData = _.cloneDeep(payload);
      const conditions = copyData.filter(
        item =>
          item.value !== '' &&
          item.value !== undefined &&
          item.value.length !== 0
      );
      return {
        ...state,
        conditions: conditions
      };
    }
  },
  DEFAULT_SEARCH_PARAMS
);

export const advancedSearchConditions = handleActions(
  {},
  ADVANCED_SEARCH_CONDITIONS
);

export const searchFieldConditions = handleActions(
  {
    [UPDATE_FIELD_CONDITIONS]: (state, { type, payload }) => {
      const copyData = payload.concat();
      return copyData.filter(
        item =>
          item.value !== '' &&
          item.value !== undefined &&
          item.value.length !== 0
      );
    }
  },
  DEFAULT_SEARCH_CONDITIONS
);

export const currentCondition = handleActions(
  {
    [UPDATE_CONDITION]: (state, { type, payload }) => payload
  },
  ''
);

//搜索内容
export const account_query_value = handleActions(
  {
    [UPDATE_SEARCH_TEXT]: (state, { type, payload }) => payload
  },
  ''
);

//页码信息
export const paginationInfo = handleActions(
  {
    [GET_REPORT_LIST]: (state, { payload }) => {
      const size = payload.size;
      if (size && getPageSize(accountPageSizeKey) !== size) {
        setPageSize(accountPageSizeKey, size);
      }
      return {
        pageNo: payload['pager'],
        pageSize: size,
        total: payload['total']
      };
    },
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);

      if (size && getPageSize(accountPageSizeKey) !== size) {
        setPageSize(accountPageSizeKey, size);
      }
      return {
        pageNo: payload['pager'],
        pageSize: size,
        total: payload['total']
      };
    }
  },
  {
    pageNo: 0,
    pageSize: 0,
    total: 0
  }
);

// 品种信息
export const serverSymbols = handleActions(
  {
    [GET_SERVER_SYMBOLS]: (state, { type, payload }) => {
      let aa = payload.reduce((map, item) => {
        map[item.serverId] = item.symbols.map(symbol => ({
          label: symbol,
          value: symbol
        }));
        return map;
      }, {});
      return aa;
    }
  },
  {}
);
//组合品种组信息
const parseSymbolGroupData = data => {
  return data['symbolArr'];
};

//获取品种组下拉数据
export const symbol_group = handleActions(
  {
    [GET_SYMBOL_GROUP]: (state, { type, payload }) =>
      parseSymbolGroupData(payload)
  },
  []
);
// 报表排序字段
export const currentSortParam = handleActions(
  {
    [UPDATE_CURRENT_SORT_PARAM]: (state, { type, payload }) => payload
  },
  {}
);
//明细表头
export const detail_list_columns = handleActions(
  {
    [UPDATE_DETAIL_LIST_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);

//明细表body
export const detail_list = handleActions(
  {
    [GET_DETAIL_LIST]: (state, { type, payload }) => {
      return payload;
    }
  },
  {}
);

//当前品种组详细id
export const symbol_id = handleActions(
  {
    [UPDATE_CURRENT_SYMBOL_ID]: (state, { type, payload }) => payload
  },
  ''
);
//当前列表详细类型
export const currentListDetailType = handleActions(
  {
    [GET_DETAIL_TYPE]: (state, { type, payload }) => payload
  },
  ''
);
