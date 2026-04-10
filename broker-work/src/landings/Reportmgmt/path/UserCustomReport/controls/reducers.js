import { handleActions } from 'redux-actions';
import _ from 'lodash';
import i18n from 'utils/i18n';
import moment from 'moment';
import { dateRange, dateFormatStyle } from 'utils/config';
import { get as getPageSize, set as setPageSize } from 'utils/pageSize';
import {
  UPDATE_FIELD_CONDITIONS,
  GET_SERVER_LIST,
  UPDATE_CURRENT_SERVER,
  UPDATE_CURRENT_STATISTICAL_REPROT_TYPE,
  GET_RESOURCES,
  GET_SERVER_SYMBOLS,
  GET_REPORT_CONFIG,
  MODIFY_PARAMS,
  UPDATE_CURRENT_SORT_PARAM,
  UPDATE_PAGINATION,
  UPDATE_SEARCH_TEXT,
  INITIAL_PARAMS,
  GET_DETAIL_LIST,
  UPDATE_UPDATE_TIME,
  GET_USER_LEVEL
} from './actions';
import {
  OUTSTANDING_PRIVILEGE_TYPE,
  ADVANCED_SEARCH_CONDITIONS
} from '../../../constant.js';
import { GET_CURRENT_USER_RIGHT, GET_USER_INFO } from 'commonActions/actions';
export const pageSizeKey = 'custom_report_list';
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
    [GET_SERVER_LIST]: (state, { type, payload }) => {
      return parseServerListData(payload);
    },
    [GET_REPORT_CONFIG]: (state, { type, payload }) => {
      const reportType = payload.reportType;
      const isMt4 = reportType === 'MT4_TRADE_ORDER';
      const isMt5 = reportType === 'MT5_TRADE_ORDER';
      const end = state.filter(server => {
        if (isMt4) {
          return server.vendor === 'MT4';
        }
        if (isMt5) {
          return server.vendor === 'MT5';
        }
        return true;
      });
      return end;
    }
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

export const privilege_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const parsed = OUTSTANDING_PRIVILEGE_TYPE.concat().filter(
        item => payload[item.right]
      );
      const allType = parsed.find(item => item.value === 'all');

      if (parsed.length > 1 && !allType) {
        const _allType = OUTSTANDING_PRIVILEGE_TYPE.concat().find(
          item => item.value === 'all'
        );
        parsed.push(_allType);
      }
      return parsed;
    }
  },
  []
);

export const advanceResourceData = handleActions(
  {
    [GET_RESOURCES]: (state, { type, payload }) => payload
  },
  {}
);

export const serverSymbols = handleActions(
  {
    [GET_SERVER_SYMBOLS]: (state, { type, payload }) =>
      _.map(payload, ({ path, symbolName }) => ({
        value: path,
        label: symbolName
      }))
  },
  {}
);

export const reportConfig = handleActions(
  {
    [GET_REPORT_CONFIG]: (state, { type, payload }) => payload
  },
  {}
);

const DEFAULT_SEARCH_CONDITIONS = [
  {
    key: 'openTime',
    type: 'BETWEEN',
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

export const searchFieldConditions = handleActions(
  {
    [UPDATE_FIELD_CONDITIONS]: (state, { type, payload }) => {
      const copyData = _.cloneDeep(payload);
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

const DEFAULT_SEARCH_PARAMS = {
  reportId: '',
  ownerType: '',
  userId: '',
  keyword: '',
  pageNo: 1,
  pageSize: getPageSize(pageSizeKey),
  serverId: '',
  sortingDirection: '',
  sortingColumn: '',
  conditions: DEFAULT_SEARCH_CONDITIONS
};

export const searchParams = handleActions(
  {
    [INITIAL_PARAMS]: (state, { payload }) => {
      return {
        ...state,
        ...payload
      };
    },
    [MODIFY_PARAMS]: (state, { payload }) => {
      return {
        ...state,
        ...payload
      };
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
        sortingDirection: payload.orderDesc
      };
    },
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);

      if (size && getPageSize(pageSizeKey) !== size) {
        setPageSize(pageSizeKey, size);
      }
      return {
        ...state,
        pageNo: payload['pageNo'],
        pageSize: size
      };
    },
    [UPDATE_SEARCH_TEXT]: (state, { type, payload }) => {
      return {
        ...state,
        keyword: payload
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
    },
    [GET_REPORT_CONFIG]: (state, { type, payload }) => {
      return {
        ...state,
        reportType: payload.reportType
      };
    }
  },
  DEFAULT_SEARCH_PARAMS
);

//明细数据
export const reportList = handleActions(
  {
    [GET_DETAIL_LIST]: (state, { type, payload }) => {
      return payload;
    }
  },
  { list: [] }
);

//搜索内容
export const searchKeywords = handleActions(
  {
    [UPDATE_SEARCH_TEXT]: (state, { type, payload }) => payload
  },
  ''
);

// 报表排序字段
export const currentSortParam = handleActions(
  {
    [UPDATE_CURRENT_SORT_PARAM]: (state, { type, payload }) => payload,
    [GET_REPORT_CONFIG]: (state, { type, payload }) => {
      return {
        sortby: payload.sortingColumn,
        orderDesc: payload.sortingDirection
      };
    }
  },
  {}
);
// 列表更新时间
export const listUpdateTime = handleActions(
  {
    [UPDATE_UPDATE_TIME]: (state, { payload }) => payload
  },
  ''
);
//页码信息
export const paginationInfo = handleActions(
  {
    [GET_DETAIL_LIST]: (state, { payload }) => {
      const size = payload.size;
      if (size && getPageSize(pageSizeKey) !== size) {
        setPageSize(pageSizeKey, size);
      }
      return {
        pageNo: payload['pager'],
        pageSize: size,
        total: payload['total']
      };
    },
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);

      if (size && getPageSize(pageSizeKey) !== size) {
        setPageSize(pageSizeKey, size);
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

export const userLevel = handleActions(
  {
    [GET_USER_LEVEL]: (state, { type, payload }) => payload
  },
  []
);
