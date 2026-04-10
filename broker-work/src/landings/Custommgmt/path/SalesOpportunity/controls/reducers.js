import { handleActions } from 'redux-actions';
import {
  GET_LIST_COLUMNS,
  GET_FORM_COLUMNS,
  GET_OPPORTUNITY_LIST,
  GET_DETAIL,
  GET_OPPORTUNITY_TYPE_LIST,
  GET_LOSE_CAUSE_LIST,
  GET_FOLLOW_WAY_LIST,
  GET_SALES_STAGE_LIST,
  GET_SEARCH_TYPE_LIST,
  UPDATE_CURRENT_SALES_STAGE,
  UPDATE_CURRENT_FILTER_TYPE,
  UPDATE_CURRENT_SEARCH_TYPE,
  UPDATE_CURRENT_PAGINATION,
  UPDATE_SEARCH_TEXT,
  UPDATE_SELECTEDS,
  GET_CUSTOMER_PARTICIPANT,
  GET_IS_LOST_CUSTOMER,
  UPDATE_UPDATE_TIME,
  UPDATE_FIELD_CONDITIONS
} from './actions';
import { get as __getPageSize__, set as __setPageSize__ } from 'utils/pageSize';
import { GET_CURRENT_USER_RIGHT } from 'commonActions/actions';
import {
  SALES_OPPORTUNITY_FILTER_TYPE,
  ADVANCED_SEARCH_TYPES
} from '../constant';

const pageSizeKey = 'opportunity_list';
const getPageSize = __getPageSize__.bind(this, pageSizeKey);
const setPageSize = __setPageSize__.bind(this, pageSizeKey);

export const listColumns = handleActions(
  {
    [GET_LIST_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);

export const formColumns = handleActions(
  {
    [GET_FORM_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);

export const opportunityList = handleActions(
  {
    [GET_OPPORTUNITY_LIST]: (state, { type, payload }) => payload
  },
  { list: [] }
);

export const opportunityDetail = handleActions(
  {
    [GET_DETAIL]: (state, { type, payload }) => payload
  },
  {}
);

export const opportunityTypeList = handleActions(
  {
    [GET_OPPORTUNITY_TYPE_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const loseCauseList = handleActions(
  {
    [GET_LOSE_CAUSE_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const followWayList = handleActions(
  {
    [GET_FOLLOW_WAY_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const salesStageList = handleActions(
  {
    [GET_SALES_STAGE_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const filterTypeList = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const parsed = SALES_OPPORTUNITY_FILTER_TYPE.concat().filter(
        item => payload[item.right]
      );
      const allType = parsed.find(item => item.value === 'all');

      if (parsed.length > 1 && !allType) {
        const _allType = SALES_OPPORTUNITY_FILTER_TYPE.concat().find(
          item => item.value === 'all'
        );
        parsed.push(_allType);
      }

      return parsed;
    }
  },
  []
);

export const searchTypeList = handleActions(
  {
    [GET_SEARCH_TYPE_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const currentSalesStage = handleActions(
  {
    [GET_SALES_STAGE_LIST]: (state, { type, payload }) => payload[0],
    [UPDATE_CURRENT_SALES_STAGE]: (state, { type, payload }) => payload
  },
  {}
);

export const currentFilterType = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const parsed = SALES_OPPORTUNITY_FILTER_TYPE.concat().filter(
        item => payload[item.right]
      );
      const allType = parsed.find(item => item.value === 'all');

      if (parsed.length > 1 && !allType) {
        const _allType = SALES_OPPORTUNITY_FILTER_TYPE.concat().find(
          item => item.value === 'all'
        );
        parsed.push(_allType);
      }

      return parsed.find(item => item.value === 'all') || parsed[0] || {};
    },
    [UPDATE_CURRENT_FILTER_TYPE]: (state, { type, payload }) => payload
  },
  {}
);

export const currentSearchType = handleActions(
  {
    [GET_SEARCH_TYPE_LIST]: (state, { type, payload }) => payload[0],
    [UPDATE_CURRENT_SEARCH_TYPE]: (state, { type, payload }) => payload
  },
  {}
);

export const currentPagination = handleActions(
  {
    [UPDATE_CURRENT_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);
      if (payload['pageSize'] && getPageSize() !== size) {
        setPageSize(size);
      }
      return payload;
    }
  },
  { pageNo: 1, pageSize: getPageSize() }
);

export const searchText = handleActions(
  {
    [UPDATE_SEARCH_TEXT]: (state, { type, payload }) => payload
  },
  ''
);

export const selecteds = handleActions(
  {
    [UPDATE_SELECTEDS]: (state, { type, payload }) => payload
  },
  []
);

//当前联系人归属客户的联系人数据
export const customerParticipant = handleActions(
  {
    [GET_CUSTOMER_PARTICIPANT]: (state, { type, payload }) => payload
  },
  []
);

export const isLostCustomer = handleActions(
  {
    [GET_IS_LOST_CUSTOMER]: (state, { type, payload }) => payload,
    [GET_DETAIL]: () => true
  },
  true
);

export const advancedSearchTypes = handleActions(
  {
    //获取销售状态
    [GET_SALES_STAGE_LIST]: (state, { type, payload }) => {
      return state.map(item => {
        if (item.value === 'salesStage') {
          item.optionList = payload;
        }
        return item;
      });
    },
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const parsed = SALES_OPPORTUNITY_FILTER_TYPE.concat().filter(
        item => payload[item.right]
      );
      const allType = parsed.find(item => item.value === 'all');

      if (parsed.length > 1 && !allType) {
        const _allType = SALES_OPPORTUNITY_FILTER_TYPE.concat().find(
          item => item.value === 'all'
        );
        parsed.push(_allType);
      }
      return state.map(item => {
        if (item.value === 'filterType') {
          item.optionList = parsed;
        }
        return item;
      });
    }
    // [ADVANCED_SEARCH_TYPES]: (state, { type, payload }) => payload
  },
  ADVANCED_SEARCH_TYPES
);

export const listUpdateTime = handleActions(
  {
    [UPDATE_UPDATE_TIME]: (state, { payload }) => payload
  },
  ''
);

export const searchFieldConditions = handleActions(
  {
    [UPDATE_FIELD_CONDITIONS]: (state, { type, payload }) => {
      const copyData = payload.concat();
      copyData.map(item => {
        if (item.field === 'country' && item.value === '-1') {
          item.value = '';
        }
        return item;
      });
      return copyData.filter(
        item => item.value !== '' && item.value !== undefined
      );
    }
  },
  []
);
