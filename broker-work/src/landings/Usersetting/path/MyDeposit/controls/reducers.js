import { handleActions } from 'redux-actions';
import moment from 'moment';
import i18n from 'utils/i18n';
import { get as getPageSize, set as setPageSize } from 'utils/pageSize';
import {
  GET_DEPOSIT_DETAIL,
  GET_SERVER_LIST,
  UPDATE_CURRENT_SERVER,
  GET_REPORT_LIST,
  UPDATE_DATE_RANGE,
  UPDATE_SEARCH_TYPE,
  UPDATE_SEARCH_TEXT,
  UPDATE_NEED_REFRESH,
  GET_SEARCH_TYPE,
  RESET_SEARCH_OPTIONS,
  UPDATE_CURRENT_SORT_PARAM,
  UPDATE_PAGINATION,
  GET_STATUS,
  UPDATE_STATUS,
  agentPageSizeKey,
  GET_PROFIT_LIST,
  profitPageSizeKey,
  UPDATE_HEADER,
  UPDATE_FIELD_CONDITIONS,
  UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS,
  UPDATE_ADVANCED_LOGIC_TYPE,
  GET_SEARCH_FIELD,
  GET_MT_GROUP_LIST,
  GET_USER_GROUP_LIST,
  UPDATE_CONDITION
} from './actions';
import {
  REPORT_ADVANCED_SEARCH_CONDITIONS_EXTRA_FIELD,
  REPORT_ADVANCED_SEARCH_CONDITIONS
} from '../../../constant';

export const deposit_detail = handleActions(
  {
    [GET_DEPOSIT_DETAIL]: (state, { type, payload }) => {
      return payload;
    }
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

//获取服务器列表
export const server_list = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) =>
      parseServerListData(payload)
  },
  []
);

//获取列表默认为空
export const reportHeader = handleActions(
  {
    [UPDATE_HEADER]: (state, { type, payload }) => payload
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

// 更新列表数据
export const report_list = handleActions(
  {
    [GET_REPORT_LIST]: (state, { type, payload }) => {
      const size = payload.size;
      if (size && getPageSize(agentPageSizeKey) !== size) {
        setPageSize(agentPageSizeKey, size);
      }
      return payload;
    }
  },
  {}
);

// 更新列表数据
export const profit_list = handleActions(
  {
    [GET_PROFIT_LIST]: (state, { type, payload }) => {
      const size = payload.size;
      if (size && getPageSize(profitPageSizeKey) !== size) {
        setPageSize(profitPageSizeKey, size);
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

//搜索类型
export const account_query_item = handleActions(
  {
    [GET_SEARCH_TYPE]: (state, { type, payload }) => payload[0],
    [UPDATE_SEARCH_TYPE]: (state, { type, payload }) => payload
  },
  {}
);

export const current_status = handleActions(
  {
    [GET_STATUS]: (state, { type, payload }) => payload[0],
    [UPDATE_STATUS]: (state, { type, payload }) => payload
  },
  {}
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

//是否应该刷新数据
export const current_need_refresh = handleActions(
  {
    [UPDATE_NEED_REFRESH]: (state, { type, payload }) => payload
  },
  i18n['report.date_range_type.default_tints']
);

//当前账户／佣金报表列表排序信息类型
export const currentSortParam = handleActions(
  {
    [UPDATE_CURRENT_SORT_PARAM]: (state, { type, payload }) => payload
  },
  {}
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

//搜索类型
export const search_type = handleActions(
  {
    [GET_SEARCH_TYPE]: (state, { type, payload }) => payload
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

export const advancedSearchConditions = handleActions(
  {},
  REPORT_ADVANCED_SEARCH_CONDITIONS
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

export const currentCondition = handleActions(
  {
    [UPDATE_CONDITION]: (state, { type, payload }) => payload
  },
  ''
);
