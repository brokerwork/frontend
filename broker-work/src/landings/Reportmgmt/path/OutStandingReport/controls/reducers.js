import { handleActions } from 'redux-actions';
import {
  GET_USER_LEVEL,
  GET_OUTSTANDING_REPORT_LIST,
  outstandingSizeKey,
  UPDATE_FIELD_CONDITIONS,
  UPDATE_PAGINATION,
  MODIFY_PARAMS,
  UPDATE_UPDATE_TIME
} from './actions';
import _ from 'lodash';
import { get as getPageSize, set as setPageSize } from 'utils/pageSize';
import { GET_CURRENT_USER_RIGHT, GET_USER_INFO } from 'commonActions/actions';
import { dateRange } from 'utils/config';
import { OUTSTANDING_PRIVILEGE_TYPE } from '../constant';

export const userLevel = handleActions(
  {
    [GET_USER_LEVEL]: (state, { type, payload }) => payload
  },
  []
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
const DEFAULT_SEARCH_CONDITIONS = [
  {
    key: 'filterDate',
    type: 'between',
    value: {
      startDate: dateRange.today.start,
      endDate: dateRange.today.end
    }
  },
  {
    key: 'isSubBelong',
    type: 'equals',
    value: 'straight'
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

//页码信息
export const paginationInfo = handleActions(
  {
    [GET_OUTSTANDING_REPORT_LIST]: (state, { payload }) => {
      const size = payload.size;
      if (size && getPageSize(outstandingSizeKey) !== size) {
        setPageSize(outstandingSizeKey, size);
      }
      return {
        pageNo: payload['pager'],
        pageSize: size,
        total: payload['total']
      };
    },
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);

      if (size && getPageSize(outstandingSizeKey) !== size) {
        setPageSize(outstandingSizeKey, size);
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

//账户归属类型
export const privilege_type = handleActions(
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

const DEFAULT_SEARCH_PARAMS = {
  reportType: 'UserEarning',
  nowPage: 1,
  pageSize: getPageSize(outstandingSizeKey),
  conditions: DEFAULT_SEARCH_CONDITIONS,
  levelId: ''
};

export const searchParams = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => {
      return payload;
    },
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);

      if (size && getPageSize(outstandingSizeKey) !== size) {
        setPageSize(outstandingSizeKey, size);
      }
      return {
        ...state,
        pageNo: payload['pager'],
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

// 列表更新时间
export const listUpdateTime = handleActions(
  {
    [UPDATE_UPDATE_TIME]: (state, { payload }) => payload
  },
  ''
);
