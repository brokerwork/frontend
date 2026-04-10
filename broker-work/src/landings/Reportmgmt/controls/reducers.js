import { handleActions } from 'redux-actions';
import moment from 'moment';
import i18n from 'utils/i18n';
import {
  GET_SERVER_LIST,
  UPDATE_CURRENT_SERVER,
  UPDATE_CURRENT_PRIVILEGE_TYPE,
  UPDATE_CURRENT_STATISTICAL_REPROT_TYPE,
  GET_REPORT_LIST,
  GET_DETAIL_TYPE,
  UPDATE_DATE_RANGE,
  GET_SEARCH_TYPE,
  UPDATE_SEARCH_TYPE,
  UPDATE_SEARCH_TEXT,
  UPDATE_STATISTICAL_LIST_COLUMNS,
  UPDATE_NEED_REFRESH,
  UPDATE_COMMISSION_LIST_COLUMNS,
  GET_COMMISSION_REPORT_LIST,
  UPDATE_CURRENT_COMMISSION_REPROT_TYPE,
  UPDATE_CURRENT_OBJECT_TYPE,
  UPDATE_DETAIL_LIST_COLUMNS,
  GET_DETAIL_LIST,
  GET_FLAG,
  GET_SYMBOL_GROUP,
  UPDATE_CURRENT_SORT_PARAM,
  UPDATE_CURRENT_SYMBOL_TYPE,
  UPDATE_CURRENT_COMMISSION_FLAG,
  UPDATE_CURRENT_SYMBOL_ID,
  UPDATE_CURRENT_STATISTICAL_SUB_BELONG,
  UPDATE_CURRENT_COMMISSION_SUB_BELONG,
  commissionPpageSizeKey,
  accountPageSizeKey,
  GET_INNER_DETAIL_LIST,
  UPDATE_DETAIL_LIST_LOGIN,
  UPDATE_PAGINATION,
  GET_DOWNLOAD_LIST,
  RETRY_DEPOSIT_TYPE,
  UPDATE_SELECTED_DEPOSIT,
  GET_FAIL_DEPOSIT_COUNT,
  UPDATE_ADVANCED_LOGIC_TYPE,
  UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS,
  UPDATE_FIELD_CONDITIONS,
  GET_MT_GROUP_LIST,
  GET_USER_GROUP_LIST,
  GET_SEARCH_FIELD,
  GET_SERVER_SYMBOLS,
  RESET_SEARCH_OPTIONS,
  GET_USER_LEVEL,
  UPDATE_CURRENT_LEVEL,
  UPDATE_OUTSTANDING_LIST_COLUMNS,
  UPDATE_CURRENT_OUTSTANDING_TYPE,
  GET_OUTSTANDING_REPORT_LIST,
  UPDATE_CURRENT_OUTSTANDING_SUBBELONG,
  UPDATE_CURRENT_OUTSTANDING_PRIVILEGE_TYPE,
  outstandingSizeKey,
  NOTICE_DONE,
  UPDATE_CURRENT_RETRY_SEARCH_TEXT,
  UPDATE_CURRENT_RETRY_SEARCH_TYPE,
  UPDATE_CONDITION,
  GET_USER_SUB_LEVEL_USERS
} from './actions';
import { get as getPageSize, set as setPageSize } from 'utils/pageSize';
import { GET_CURRENT_USER_RIGHT, GET_USER_INFO } from 'commonActions/actions';

import {
  PRIVILEGE_TYPE,
  STATISTICAL_REPORT_TYPE,
  COMMISSION_REPORT_TYPE,
  REAL_TIME_COMMISSION_FLAG,
  REPORT_ADVANCED_SEARCH_CONDITIONS_EXTRA_FIELD,
  REPORT_ADVANCED_SEARCH_CONDITIONS,
  OUTSTANDING_REPORT_TYPE,
  OUTSTANDING_PRIVILEGE_TYPE,
  NOTICE_KEY,
  NOTICE_VERSION,
  FAILD_COMMISSION_SEARCH_TYPE
} from '../constant';

import { getUserInfo } from 'utils/userInfo';

//当前列表详细类型
export const currentListDetailType = handleActions(
  {
    [GET_DETAIL_TYPE]: (state, { type, payload }) => payload
  },
  ''
);

//当前账户／佣金报表列表排序信息类型
export const currentSortParam = handleActions(
  {
    [UPDATE_CURRENT_SORT_PARAM]: (state, { type, payload }) => payload
  },
  {}
);

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

//获取服务器列表
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

//更新当前账户归属类型或者用户id
export const current_privilege_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const parsed = PRIVILEGE_TYPE.concat().filter(
        item => payload[item.right]
      );

      return parsed;
    },
    [UPDATE_CURRENT_PRIVILEGE_TYPE]: (state, { type, payload }) => payload
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

//更新当前选中品种组
export const current_symbol_group = handleActions(
  {
    [GET_SYMBOL_GROUP]: (state, { type, payload }) =>
      parseSymbolGroupData(payload)[0],
    [UPDATE_CURRENT_SYMBOL_TYPE]: (state, { type, payload }) => payload
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

// 当前选中的用户树是否直属
export const current_statistical_subBelong = handleActions(
  {
    [UPDATE_CURRENT_STATISTICAL_SUB_BELONG]: (state, { type, payload }) =>
      payload
  },
  ''
);

//账户报表类型
export const statistical_report_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const statisticalReportType = STATISTICAL_REPORT_TYPE.concat().filter(
        item => payload[item.right]
      );
      return statisticalReportType;
    }
  },
  []
);

//更新当前账户报表类型
export const current_statistical_report_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const statisticalReportType = STATISTICAL_REPORT_TYPE.concat().filter(
        item => payload[item.right]
      );
      return (
        statisticalReportType.find(item => item.value === 'AccountSummary') ||
        statisticalReportType[0] ||
        {}
      );
    },
    [UPDATE_CURRENT_STATISTICAL_REPROT_TYPE]: (state, { type, payload }) => {
      return payload;
    }
  },
  {}
);

//获取列表默认为空
export const statistical_list_columns = handleActions(
  {
    [UPDATE_STATISTICAL_LIST_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);

// 更新列表数据
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

//时间范围
export const date_range = handleActions(
  {
    [UPDATE_DATE_RANGE]: (state, { type, payload }) => payload
  },
  {
    startDate: moment()
      .subtract(29, 'days')
      .startOf('day'),
    endDate: moment().endOf('day')
  }
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

//佣金报表类型
export const commission_report_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const commissionReportType = COMMISSION_REPORT_TYPE.concat().filter(
        item => payload[item.right]
      );
      return commissionReportType;
    }
  },
  []
);

// 当前选中的用户树是否直属
export const current_commission_subBelong = handleActions(
  {
    [UPDATE_CURRENT_COMMISSION_SUB_BELONG]: (state, { type, payload }) =>
      payload
  },
  {
    isSubBelong: null,
    userIds: null
  }
);

//更新当前佣金报表类型
export const current_commission_report_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const commissionReportType = COMMISSION_REPORT_TYPE.concat().filter(
        item => payload[item.right]
      );
      return (
        commissionReportType.find(item => item.value === 'Lots') ||
        commissionReportType[0] ||
        {}
      );
    },
    [UPDATE_CURRENT_COMMISSION_REPROT_TYPE]: (state, { type, payload }) =>
      payload
  },
  {}
);

//更新当前到账状态
export const current_commission_flag = handleActions(
  {
    [GET_FLAG]: (state, { type, payload }) =>
      payload.find(item => item.value === 'all'),
    [UPDATE_CURRENT_COMMISSION_FLAG]: (state, { type, payload }) => payload
  },
  REAL_TIME_COMMISSION_FLAG.find(item => item.value === 'all')
);

//获取佣金列表默认为空
export const commission_list_columns = handleActions(
  {
    [UPDATE_COMMISSION_LIST_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);

//返佣对象类型
export const object_type = handleActions(
  {
    [GET_USER_INFO]: (state, { type, payload }) => {
      if (payload.levelId) {
        const currentObject = [
          { label: `${payload.entityNo} : ${payload.name}`, value: payload.id }
        ];
        return currentObject;
      }
    }
  },
  []
);

//更新当前返佣对象
export const current_object_type = handleActions(
  {
    [UPDATE_CURRENT_OBJECT_TYPE]: (state, { type, payload }) => payload
  },
  {}
);

// 更新佣金列表数据
export const commission_report_list = handleActions(
  {
    [GET_COMMISSION_REPORT_LIST]: (state, { type, payload }) => {
      const size = payload.size;
      if (size && getPageSize(commissionPpageSizeKey) !== size) {
        setPageSize(commissionPpageSizeKey, size);
      }
      return payload;
    }
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

//明细的login
export const currentCommissionItemLogin = handleActions(
  {
    [UPDATE_DETAIL_LIST_LOGIN]: (state, { type, payload }) => payload
  },
  ''
);

// 交易返佣报表的明细表中表
export const innerDetailList = handleActions(
  {
    [GET_INNER_DETAIL_LIST]: (state, { type, payload }) => payload
  },
  {}
);

//当前分页状态
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

export const downloadList = handleActions(
  {
    [GET_DOWNLOAD_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const depositType = handleActions(
  {
    [RETRY_DEPOSIT_TYPE]: (state, { type, payload }) => {
      return payload;
    }
  },
  ''
);

export const selectedDepositIds = handleActions(
  {
    [UPDATE_SELECTED_DEPOSIT]: (state, { type, payload }) => {
      return payload.map(deposit => deposit.id);
    }
  },
  []
);

export const selectedDeposits = handleActions(
  {
    [UPDATE_SELECTED_DEPOSIT]: (state, { type, payload }) => payload
  },
  []
);

//返佣失败记录数
export const failDepositCount = handleActions(
  {
    [GET_FAIL_DEPOSIT_COUNT]: (state, { type, payload }) => payload
  },
  ''
);

//返佣失败搜索
export const failSearchText = handleActions(
  {
    [UPDATE_CURRENT_RETRY_SEARCH_TEXT]: (state, { type, payload }) => payload
  },
  ''
);

//返佣失败搜索类型
export const failSearchType = handleActions(
  {
    [UPDATE_CURRENT_RETRY_SEARCH_TYPE]: (state, { type, payload }) => payload
  },
  FAILD_COMMISSION_SEARCH_TYPE[0]
);

export const advancedSearchType = handleActions(
  {
    [GET_SEARCH_FIELD]: (state, { type, payload }) => {
      const types = getAdvancedSearchTypes(state, payload);
      return types;
    }
  },
  []
);

//高级搜索类型
export const advancedLogicType = handleActions(
  {
    [UPDATE_ADVANCED_LOGIC_TYPE]: (state, { type, payload }) => payload
  },
  'AND'
);

export const selectedAdvancedSearchConditions = handleActions(
  {
    [UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS]: (
      state,
      { type, payload }
    ) => {
      const copyData = JSON.parse(JSON.stringify(payload));
      const dateArray = [
        'first_deposit_day',
        'regdate',
        'open_time',
        'close_time'
      ];
      const arrayFields = ['searchSelectCheckbox', 'selectCheckbox'];
      for (let logictype in copyData) {
        copyData[logictype] = copyData[logictype].map(item => {
          if (dateArray.includes(item.key)) {
            return {
              ...item,
              value: {
                startDate: moment(item.value['startDate']),
                endDate: moment(item.value['endDate'])
              }
            };
          }
          return item;
        });
      }
      return copyData;
    }
  },
  { AND: [], OR: [] }
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
  []
);

export const mtGroupList = handleActions(
  {
    [GET_MT_GROUP_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const userGroupList = handleActions(
  {
    [GET_USER_GROUP_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const advancedSearchConditions = handleActions(
  {},
  REPORT_ADVANCED_SEARCH_CONDITIONS
);

export const serverSymbols = handleActions(
  {
    [GET_SERVER_SYMBOLS]: (state, { type, payload }) => {
      return payload.reduce((map, item) => {
        map[item.serverId] = item.symbols.map(symbol => ({
          label: symbol,
          value: symbol
        }));
        return map;
      }, {});
    }
  },
  {}
);

// 整理生成条件的数据，使用的时候要对服务器处理
function getAdvancedSearchTypes(state, payload) {
  const types = payload.concat().filter(item => item.fieldType);

  types.map(type => {
    switch (type.fieldType) {
      case 'input':
        type.conditions = ['equals', 'like'];
        break;
      case 'number':
        type.conditions = ['equals', 'not_equals', 'big', 'less'];
        break;
      case 'ticket':
        type.conditions = ['equals'];
        break;
      case 'select':
        type.conditions = ['equals'];
        break;
      case 'date':
        type.conditions = ['equals'];
        break;
      case 'customer':
        type.conditions = ['equals'];
        break;
      default:
        break;
    }
    switch (type.value) {
      case 'comment':
        type.conditions = ['equals', 'like', 'not_equals', 'not_like'];
        break;
      case 'login':
        type.conditions = ['equals', 'like', 'big', 'less', 'between'];
        type.rangeConditions = ['between'];
        break;
    }
    return type;
  });

  const newTypes = types.concat(REPORT_ADVANCED_SEARCH_CONDITIONS_EXTRA_FIELD);
  return newTypes;
}

export const userLevel = handleActions(
  {
    [GET_USER_LEVEL]: (state, { type, payload }) => payload
  },
  []
);

export const currentUserLevel = handleActions(
  {
    [GET_USER_LEVEL]: (state, { type, payload }) => payload[0],
    [UPDATE_CURRENT_LEVEL]: (state, { type, payload }) => {
      return payload;
    }
  },
  {}
);

export const outStandingReportType = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const outStandingReportTypes = OUTSTANDING_REPORT_TYPE.concat().filter(
        item => payload[item.right]
      );
      return outStandingReportTypes;
    }
  },
  []
);

export const outStandingListcolumns = handleActions(
  {
    [UPDATE_OUTSTANDING_LIST_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);

export const currentOutstandingReportType = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const outstandingReportType = OUTSTANDING_REPORT_TYPE.concat().filter(
        item => payload[item.right]
      );
      return (
        outstandingReportType.find(item => item.value === 'UserEarning') ||
        outstandingReportType[0] ||
        {}
      );
    },
    [UPDATE_CURRENT_OUTSTANDING_TYPE]: (state, { type, payload }) => {
      return payload;
    }
  },
  {}
);

// 更新列表数据
export const outstanding_report_list = handleActions(
  {
    [GET_OUTSTANDING_REPORT_LIST]: (state, { type, payload }) => {
      const size = payload.size;
      if (size && getPageSize(outstandingSizeKey) !== size) {
        setPageSize(outstandingSizeKey, size);
      }
      return payload;
    }
  },
  {}
);

export const current_outstanding_subBelong = handleActions(
  {
    [UPDATE_CURRENT_OUTSTANDING_SUBBELONG]: (state, { type, payload }) => {
      return payload;
    }
  },
  {}
);

//业绩报表用户归属类型
export const outstanding_privilege_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const parsed = OUTSTANDING_PRIVILEGE_TYPE.concat().filter(
        item => payload[item.right]
      );
      const allType = parsed.find(item => item.value === 'allSee');

      if (parsed.length > 1 && !allType) {
        const _allType = OUTSTANDING_PRIVILEGE_TYPE.concat().find(
          item => item.value === 'allSee'
        );
        parsed.push(_allType);
      }

      return parsed;
    }
  },
  []
);

//更新当前业绩报表用户归属类型或者用户id
export const current_outstanding_privilege_type = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const parsed = OUTSTANDING_PRIVILEGE_TYPE.concat().filter(
        item => payload[item.right]
      );

      return parsed;
    },
    [UPDATE_CURRENT_OUTSTANDING_PRIVILEGE_TYPE]: (state, { type, payload }) =>
      payload
  },
  {}
);

export const needShowNotice = handleActions(
  {
    [GET_USER_INFO]: (state, { type, payload }) => {
      const id = payload.id;
      return localStorage.getItem(`${NOTICE_KEY}_${id}`) !== NOTICE_VERSION;
    },
    [NOTICE_DONE]: (state, { type, paylod }) => {
      const { id } = getUserInfo();
      localStorage.setItem(`${NOTICE_KEY}_${id}`, NOTICE_VERSION);
      return false;
    }
  },
  false
);
export const currentCondition = handleActions(
  {
    [UPDATE_CONDITION]: (state, { type, payload }) => payload
  },
  ''
);
