import { handleActions } from 'redux-actions';
import _ from 'lodash';
import i18n from 'utils/i18n';
import { dateRange, dateFormatStyle } from 'utils/config';
import {
  GET_SERVER_LIST,
  UPDATE_CURRENT_SERVER,
  GET_REPORT_LIST,
  UPDATE_UPDATE_TIME,
  UPDATE_CURRENT_COMMISSION_REPROT_TYPE,
  MODIFY_PARAMS,
  commissionPageSizeKey,
  UPDATE_CONDITION,
  UPDATE_SEARCH_TEXT,
  UPDATE_FIELD_CONDITIONS,
  SELECT_ITEM,
  UPDATE_CURRENT_SORT_PARAM,
  UPDATE_PAGINATION,
  CHECK_FAIL_NUM
} from './actions';
import { get as getPageSize, set as setPageSize } from 'utils/pageSize';
import {
  COMMISSION_REPORT_TYPE,
  ADVANCED_SEARCH_CONDITIONS
} from '../../../constant.js';
import TableType, {
  LOTSNEW_HEADER,
  DEPOSIT_HEADER,
  NETDEPOSIT_HEADER,
  PROFIT_HEADER,
  NETPROFIT_HEADER,
  COMMISSIONCHARGE_HEADER,
  REALTIME_HEADER,
  RTCOMMISSION_HEADER,
  EXPORT_TYPE,
  EXPORT_COMMON_TYPE,
  LOTSNEWSEARCH_HEADER
} from '../constants';
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
      if (size && getPageSize(commissionPageSizeKey) !== size) {
        setPageSize(commissionPageSizeKey, size);
      }
      return payload;
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
// 左侧筛选条件
export const advancedSearchType = handleActions(
  {
    [UPDATE_CURRENT_COMMISSION_REPROT_TYPE]: (state, { payload }) => {
      if (
        [
          'DEPOSIT',
          'NETDEPOSIT',
          'PROFIT',
          'NETPROFIT',
          'COMMISSIONCHARGE'
        ].includes(payload.toUpperCase())
      )
        return TableType['COMMON_ADVANCED_SEARCH_TYPE'];
      const types = `${payload.toUpperCase()}_ADVANCED_SEARCH_TYPE`;
      return TableType[types];
    }
  },
  []
);

//获取列表默认为空
export const commission_list_columns = handleActions(
  {
    [UPDATE_CURRENT_COMMISSION_REPROT_TYPE]: (state, { type, payload }) => {
      let reportNewHeader = [];
      switch (payload) {
        case 'LotsNew':
          reportNewHeader = LOTSNEW_HEADER;
          break;
        case 'Deposit':
          reportNewHeader = DEPOSIT_HEADER;
          break;
        case 'NetDeposit':
          reportNewHeader = NETDEPOSIT_HEADER;
          break;
        case 'Profit':
          reportNewHeader = PROFIT_HEADER;
          break;
        case 'NetProfit':
          reportNewHeader = NETPROFIT_HEADER;
          break;
        case 'CommissionCharge':
          reportNewHeader = COMMISSIONCHARGE_HEADER;
          break;
        case 'RealTime':
          reportNewHeader = REALTIME_HEADER;
          break;
        case 'RTCommission':
          reportNewHeader = RTCOMMISSION_HEADER;
          break;
        case 'LotsNewSearch':
          reportNewHeader = LOTSNEWSEARCH_HEADER;
          break;
      }
      return reportNewHeader;
    }
  },
  []
);

export const current_commission_report_type = handleActions(
  {
    [UPDATE_CURRENT_COMMISSION_REPROT_TYPE]: (state, { type, payload }) => {
      return COMMISSION_REPORT_TYPE.find(item => item.value === payload);
    }
  },
  {}
);

const DEFAULT_SEARCH_CONDITIONS = [
  {
    key: 'filterDate',
    type: 'between',
    value: {
      startDate: dateRange.today.start,
      endDate: dateRange.today.end
    }
  }
];

const DEFAULT_SEARCH_PARAMS = {
  reportType: 'Lots',
  accountQueryValue: '',
  nowPage: 1,
  pageSize: getPageSize(commissionPageSizeKey),
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
    [UPDATE_CURRENT_COMMISSION_REPROT_TYPE]: (state, { type, payload }) => {
      return {
        ...state,
        reportType: payload
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
    [UPDATE_CURRENT_SORT_PARAM]: (state, { type, payload }) => {
      return {
        ...state,
        sortingColumn: payload.sortby,
        sortingDirection: payload.orderDesc ? 'desc' : 'asc'
      };
    },
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);

      if (size && getPageSize(commissionPageSizeKey) !== size) {
        setPageSize(commissionPageSizeKey, size);
      }
      return {
        ...state,
        nowPage: payload['pager'],
        pageSize: size
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

export const advancedSearchConditions = handleActions(
  {},
  ADVANCED_SEARCH_CONDITIONS
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
      if (size && getPageSize(commissionPageSizeKey) !== size) {
        setPageSize(commissionPageSizeKey, size);
      }
      return {
        pageNo: payload['pager'],
        pageSize: size,
        total: payload['total']
      };
    },
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);

      if (size && getPageSize(commissionPageSizeKey) !== size) {
        setPageSize(commissionPageSizeKey, size);
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

//返佣对象类型
export const object_type = handleActions(
  {
    [UPDATE_CURRENT_COMMISSION_REPROT_TYPE]: (state, { type, payload }) => {
      const isAllType = [
        'LotsNew',
        'RTCommission',
        'CommissionCharge',
        'RealTime'
      ];
      const userInfoPromise = getUserInfo();
      const copyTypes = [];
      copyTypes.push({
        label: `${userInfoPromise.entityNo} : ${userInfoPromise.name}`,
        value: `${userInfoPromise.id}`
      });
      if (isAllType.includes(payload)) {
        copyTypes.push({
          label: i18n['report.download_tips_modal.summary_user'],
          value: 'all'
        });
      }
      return copyTypes;
    }
  },
  []
);

//已经选择的失败条数
export const selectedItems = handleActions(
  {
    [SELECT_ITEM]: (state, { payload }) => payload
  },
  {}
);
// 报表排序字段
export const currentSortParam = handleActions(
  {
    [UPDATE_CURRENT_SORT_PARAM]: (state, { type, payload }) => payload
  },
  {}
);
//返佣字段明细
export const currentDownloadOptions = handleActions(
  {
    [UPDATE_CURRENT_COMMISSION_REPROT_TYPE]: (state, { type, payload }) => {
      const exportSpecialtType = [
        'LotsNew',
        'RTCommission',
        'CommissionCharge'
      ];
      const nullExportType = ['LotsNewSearch'];
      if (exportSpecialtType.includes(payload)) {
        return EXPORT_TYPE;
      } else if (nullExportType.includes(payload)) {
        return null;
      } else return EXPORT_COMMON_TYPE;
    }
  },
  []
);
// 返佣失败数量
export const failNum = handleActions(
  {
    [CHECK_FAIL_NUM]: (state, { type, payload }) => payload.total
  },
  0
);
