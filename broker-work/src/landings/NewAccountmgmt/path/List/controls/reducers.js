import { handleActions, handleAction } from 'redux-actions';
import { combineReducers } from 'redux';
import { get as __getPageSize__, set as __setPageSize__ } from 'utils/pageSize';
import {
  UPDATE_CURRENT_PRIVILEGE_TYPE,
  GET_ACCOUNT_LIST,
  UPDATE_PAGINATION,
  UPDATE_ORDER_BY,
  UPDATE_DATE_RANGE,
  UPDATE_SELECTED_ACCOUNT_IDS,
  GET_TA_USER_BY_CUSTOMER_ID,
  UPDATE_CONDITION,
  UPDATE_SEARCH_LOGIC_TYPE,
  UPDATE_FIELD_CONDITIONS,
  UPDATE_FILTER_USER,
  UPDATE_UPDATE_TIME,
  UPDATE_FUZZY_VAL
} from './actions';
import { GET_CURRENT_USER_RIGHT } from 'commonActions/actions';
import {
  PRIVILEGE_SEARCH_TYPE,
  SEARCH_TYPE,
  PRIVILEGE_TYPE,
  ADVANCED_SEARCH_TYPE,
  ADVANCED_SEARCH_CONDITIONS
} from '../constant';
import {
  GET_FORM_COLUMNS,
  GET_RESOURCES,
  GET_MT_GROUP_BY_RIGHT
} from '../../../controls/actions';
import i18n from 'utils/i18n';

export const privilegeTypeList = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      // all必须在数组最后一位
      const priv = _.cloneDeep(PRIVILEGE_TYPE);
      // 这里是因为所有选项要一直显示，但是又必须传权限，所以就重定义为整个账户的权限。并且不影响详情等其他模块的权限
      priv[0].value === 'all' ? (priv[0].right = 'ACCOUNT') : null;
      return priv.reduce((prevValue, currentValue) => {
        if (payload[currentValue.right]) {
          prevValue.push(currentValue);
        } else if (currentValue.value === 'all' && prevValue.length > 1) {
          prevValue.push(currentValue);
        }

        return prevValue;
      }, []);
    }
  },
  []
);

export const currentPrivilegeType = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      const filtered = PRIVILEGE_TYPE.filter(item => payload[item.right]);
      const current =
        filtered.find(item => item.value === 'all') || filtered[0] || {};

      return current.value;
    },
    [UPDATE_CURRENT_PRIVILEGE_TYPE]: (state, { payload }) => payload,
    [UPDATE_FILTER_USER]: (state, { payload }) => 'all'
  },
  ''
);

export const searchTypeList = handleActions({}, SEARCH_TYPE);

export const orderBy = handleActions(
  {
    [UPDATE_ORDER_BY]: (state, { payload }) => payload
  },
  { type: 'regdate', desc: true, name: i18n['account.list.head.regdate'] }
);

export const accountList = handleActions(
  {
    [GET_ACCOUNT_LIST]: (state, { payload }) => payload.list
  },
  []
);

export const accountTotal = handleActions(
  {
    [GET_ACCOUNT_LIST]: (state, { payload }) => ({
      balance: payload.totalBalance,
      equity: payload.totalEquity,
      profit: payload.totalProfit,
      balance: payload.totalBalance,
      credit: payload.totalCredit,
      margin: payload.totalMargin,
      marginFree: payload.totalMarginFree,
      marginLevel: payload.totalMarginLevel
    })
  },
  {
    balance: 0,
    equity: 0,
    profit: 0,
    balance: 0,
    credit: 0,
    margin: 0,
    marginFree: 0,
    marginLevel: 0
  }
);

const pageSizeKey = 'account_list';
const getPageSize = __getPageSize__.bind(this, pageSizeKey);
const setPageSize = __setPageSize__.bind(this, pageSizeKey);

export const currentPagination = handleActions(
  {
    [UPDATE_PAGINATION]: (state, { type, payload }) => {
      const size = Number(payload['pageSize']);

      if (payload['pageSize'] && getPageSize() !== size) {
        setPageSize(size);
      }

      return {
        ...state,
        ...payload
      };
    },
    [UPDATE_FUZZY_VAL]: (state, { type, payload }) => ({
      ...state,
      pageNo: 1
    }),
    [UPDATE_DATE_RANGE]: (state, { type, payload }) => ({
      ...state,
      pageNo: 1
    }),
    [UPDATE_CURRENT_PRIVILEGE_TYPE]: (state, { type, payload }) => ({
      ...state,
      pageNo: 1
    }),
    [UPDATE_CONDITION]: (state, { type, payload }) => ({
      ...state,
      pageNo: 1
    }),
    [UPDATE_SEARCH_LOGIC_TYPE]: (state, { type, payload }) => ({
      ...state,
      pageNo: 1
    }),
    [UPDATE_FIELD_CONDITIONS]: (state, { type, payload }) => ({
      ...state,
      pageNo: 1
    }),
    [UPDATE_FILTER_USER]: (state, { type, payload }) => ({
      ...state,
      pageNo: 1
    }),
    [GET_ACCOUNT_LIST]: (state, { type, payload }) => {
      return {
        total: payload.total,
        pageNo: payload.pageNo,
        pageSize: payload.pageSize
      };
    }
  },
  { pageNo: 1, pageSize: getPageSize() }
);

export const fieldConditions = handleActions(
  {
    [UPDATE_FIELD_CONDITIONS]: (state, { payload }) => {
      const searchOption = state.find(item => item.isSearchOption);
      const result = [...payload];

      if (searchOption) {
        result.push(searchOption);
      }

      return result;
    }
  },
  []
);

export const dateRange = handleActions(
  {
    [UPDATE_DATE_RANGE]: (state, { payload }) => payload
  },
  {}
);

export const selectedAccountIds = handleActions(
  {
    [UPDATE_SELECTED_ACCOUNT_IDS]: (state, { payload }) => payload
  },
  []
);

export const advancedSearchTypes = handleActions(
  {
    [GET_FORM_COLUMNS]: (state, { type, payload }) => {
      const types = [];

      state.forEach(item => {
        if (item.default) {
          types.push(item);
        } else {
          const keys = item.key.split('.');

          if (
            payload[keys[0]] &&
            payload[keys[0]].some(_item => _item.key === keys[1])
          ) {
            types.push(item);
          }
        }
      });
      return types;
    },
    [GET_RESOURCES]: (state, { type, payload }) => {
      let copyed = JSON.parse(JSON.stringify(state));
      const {
        leverage = [],
        maxLeverage = [],
        currency = [],
        mtGroup = [],
        accountGroup = []
      } = payload;
      const list = {
        group: mtGroup,
        leverage,
        maxLeverage,
        currency,
        userGroup: accountGroup
      };

      copyed = copyed.map(item => {
        return {
          ...item,
          optionList: list[item.value] || item.optionList
        };
      });

      return copyed;
    },
    [GET_MT_GROUP_BY_RIGHT]: (state, { type, payload }) => {
      let copyed = JSON.parse(JSON.stringify(state));

      copyed = copyed.map(item => {
        if (item.value === 'group') item.optionList = payload;

        return item;
      });

      return copyed;
    }
  },
  ADVANCED_SEARCH_TYPE
);

export const taUserInfo = handleActions(
  {
    [GET_TA_USER_BY_CUSTOMER_ID]: (state, { type, payload }) => payload[0] || {}
  },
  {}
);

export const searchCondition = handleActions(
  {
    [UPDATE_CONDITION]: (state, { payload }) => payload
  },
  ''
);

export const searchLogicType = handleActions(
  {
    [UPDATE_SEARCH_LOGIC_TYPE]: (state, { payload }) => payload
  },
  'AND'
);

export const filterUser = handleActions(
  {
    [UPDATE_FILTER_USER]: (state, { payload }) => payload,
    [UPDATE_CURRENT_PRIVILEGE_TYPE]: (state, { payload }) => ({})
  },
  {}
);

export const advancedSearchConditions = handleActions(
  {},
  ADVANCED_SEARCH_CONDITIONS
);

export const listUpdateTime = handleActions(
  {
    [GET_ACCOUNT_LIST]: (state, { res }) => {
      if (res.result) {
        return res.time;
      }
    },
    [UPDATE_UPDATE_TIME]: (state, { payload }) => payload
  },
  ''
);

export const fuzzyValue = handleActions(
  {
    [UPDATE_FUZZY_VAL]: (state, { payload }) => payload
  },
  ''
);
