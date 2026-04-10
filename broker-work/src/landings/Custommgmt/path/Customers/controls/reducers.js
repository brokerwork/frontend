import moment from 'moment';
import { handleActions, handleAction } from 'redux-actions';
import i18n from 'utils/i18n';
import { dateRange as __dateRange__ } from 'utils/config';
import { getCountry } from 'utils/country';
import { FormattedMessage } from 'react-intl';
import timeLineDataTransfer from 'components/TimeLine/transfer';

import { get as __getPageSize__, set as __setPageSize__ } from 'utils/pageSize';
import DeleteRecord from '../containers/DeleteRecord';
import AudioTip from 'components/AudioTip';
import cs from '../../../index.less';

import {
  GET_CUSTOMERS,
  GET_CUSTOMER_COLUMNS,
  DELETE_CUSTOMERS,
  UPDATE_SEARCH_TYPE,
  UPDATE_FUZZY_SEARCH_TYPE,
  UPDATE_FUZZY_SEARCH_TEXT,
  UPDATE_SELECTED_ITEMS,
  SHOW_HIDE_BATCH_ACTIONS,
  UPDATE_PAGENATION_INFO,
  UPDATE_PAGENATION_TOTAL,
  SHOW_CUSTOMER_DETAIL_MODAL,
  SHOW_CUSTOMER_CARD,
  GET_CUSTOMER_FORM_FIELDS,
  GET_CUSTOMER_DETAIL_BY_ID,
  UPDATE_CUSTOMER_DETAIL_INFO,
  UPDATE_CUSTOMER_DATA,
  GET_FOLLOW_WAY_OPTIONS,
  GET_PRODUCT_INFO,
  UPDATE_DATE_RANGE,
  UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS,
  UPDATE_ADVANCED_LOGIC_TYPE,
  UPDATE_FIELD_CONDITIONS,
  GET_OPREATE_LOG,
  UPDATE_SEARCH_DATE,
  GET_CUSTOMER_LINK_SOURCE,
  UPDATE_CURRENT_SORT_PARAM,
  GET_CUSTOMER_SOURCE,
  UPDATE_CONDITION,
  UPDATE_CURRENT_SOURCE,
  UPDATE_OWN_ID,
  UPDATE_STATE_TYPE,
  DEVIDE_CUSTOMERS,
  GET_CONTRACT_LIST_OF_CUSTOMER_BY_ID,
  GET_CONTACTS_OF_CUSTOMER_BY_ID,
  CLEAR_CUSTOMER_DETAIL_INFO,
  OPPORTUNITIES_OF_CUSTOMER_BY_ID,
  GET_ACCOUNTS_OF_CUSTOMER_BY_ID,
  GET_CUSTOMER_ACTIVITIES_ALL,
  GET_CUSTOMER_ACTIVITIES_FOLLOW,
  GET_CUSTOMER_ACTIVITIES_OPERATE,
  GET_CUSTOMER_ACTIVITIES_TRADE,
  GET_TW_USER_OF_CUSTOMER_BY_ID,
  GET_BILL_LIST_OF_CUSTOMER_BY_ID,
  GET_ACCOUNT_OWNER_OF_CUSTOMER_BY_ID,
  GET_ACCOUNT_OWNER_FORM_COLUMNS,
  GET_TENANT_TYPE,
  GET_DELETE_REASON,
  DO_FUZZY_SEARCH,
  GET_IS_ADAPT_ON,
  UPDATE_UPDATE_TIME,
  CHECK_IMPORT_CONTENT_SUCCESS,
  EXECUTE_IMPORT,
  SELECT_IMPORT_FILE,
  VERIFY_IDENTITY,
  GET_DEPLOY_LIST_OF_CUSTOMER_BY_ID,
  CHANGE_DEFAULT_APPROVER_INFO,
  GET_BIND_BW_USER_DIRECT_USER_COUNT,
  TOGGLE_FIELD_ENABLE
} from './actions';
import { GET_CURRENT_USER_RIGHT } from 'commonActions/actions';
import { GET_FORM_COLUMNS as GET_CONTACTS_FORM_COLUMNS } from '../../Contacts/controls/actions';
import { GET_FORM_COLUMNS as GET_OPPORTUNITY_COLUMNS } from '../../SalesOpportunity/controls/actions';
import {
  ADVANCED_SEARCH_CONDITIONS,
  ADVANCED_SEARCH_TYPE,
  ADVANCED_SEARCH_TIME_TYPE,
  ACTION_BAR_SEARCH_TYPE,
  CUSTOMER_STATE_TYPES,
  SELECTABLE_CUSTOMER_STATE_KEYS,
  CUSTOMER_TIME_SEARCH_TYPE,
  FUZZY_SEARCH_TYPES
} from '../constant';
import { MESSAGE_TYPES } from '../../../../Msgmgmt/constant';
import { APPROVE_FIELDS_MAP } from '../constant';

const pageSizeKey = 'customer_list';
const getPageSize = __getPageSize__.bind(this, pageSizeKey);
const setPageSize = __setPageSize__.bind(this, pageSizeKey);
const country = getCountry();
const opreateWay = {
  CREATE: i18n['customer.detail.opreate_way_create'],
  EDIT: i18n['customer.detail.opreate_way_edit'],
  DELETE: i18n['customer.detail.opreate_way_delete'],
  CUSTOMER: i18n['customer.detail.opreate_type_customer'],
  CONTACT: i18n['customer.detail.opreate_type_contact'],
  OPPORTUNITY: i18n['customer.detail.opreate_type_opportunity'],
  TRADERWORK: i18n['customer.detail.opreate_log_message_source_ta']
};

export const typesOptions = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      return MESSAGE_TYPES.filter(item => {
        if (['ALL', 'WEB', 'WEB_ALERT'].includes(item.value)) return false;
        return payload[item.right];
      });
    }
  },
  []
);
function dealCustomerVirtualState(info) {
  return {
    ...info,
    virtualState: info.isLost ? 'Lost' : info.customerState
  };
}
//详情基础信息
export const customerDetailInfo = handleActions(
  {
    [GET_CUSTOMER_DETAIL_BY_ID]: (state, { payload }) =>
      dealCustomerVirtualState(payload),
    [UPDATE_CUSTOMER_DETAIL_INFO]: (state, { payload }) =>
      dealCustomerVirtualState(payload),
    [UPDATE_CUSTOMER_DATA]: (state, { payload }) =>
      dealCustomerVirtualState({
        ...state,
        ...payload
      }),
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => ({})
  },
  {}
);

//联系人列表
export const contactsOfCustomer = handleActions(
  {
    [GET_CONTACTS_OF_CUSTOMER_BY_ID]: (state, { payload }) => payload,
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => []
  },
  []
);

//合同列表
export const contractListOfCustomer = handleActions(
  {
    [GET_CONTRACT_LIST_OF_CUSTOMER_BY_ID]: (state, { payload }) => payload,
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => []
  },
  []
);

//账单列表
export const billListOfCustomer = handleActions(
  {
    [GET_BILL_LIST_OF_CUSTOMER_BY_ID]: (state, { payload }) => payload,
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => []
  },
  []
);

//部署列表
export const deployListOfCustomer = handleActions(
  {
    [GET_DEPLOY_LIST_OF_CUSTOMER_BY_ID]: (state, { payload }) => payload,
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => []
  },
  []
);

//tw用户
export const twUserOfCustomer = handleActions(
  {
    [GET_TW_USER_OF_CUSTOMER_BY_ID]: (state, { payload }) => payload || {},
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => ({})
  },
  {}
);

//销售机会列表
export const opportunitiesOfCustomer = handleActions(
  {
    [OPPORTUNITIES_OF_CUSTOMER_BY_ID]: (state, { payload }) => payload,
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => []
  },
  []
);

//账户列表
export const accountsOfCustomer = handleActions(
  {
    [GET_ACCOUNTS_OF_CUSTOMER_BY_ID]: (state, { payload }) => payload,
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => []
  },
  []
);

//
export const customerActivitiesAll = handleActions(
  {
    [GET_CUSTOMER_ACTIVITIES_ALL]: (state, { payload }) => {
      if (payload.pager === 1) return payload;
      return {
        ...state,
        ...payload,
        list: state.list.concat(payload.list)
      };
    },
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => ({
      list: []
    })
  },
  {
    list: []
  }
);

export const customerActivitiesOperate = handleActions(
  {
    [GET_CUSTOMER_ACTIVITIES_OPERATE]: (state, { payload }) => {
      if (payload.pager === 1) return payload;
      return {
        ...state,
        ...payload,
        list: state.list.concat(payload.list)
      };
    },
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => ({
      list: []
    })
  },
  {
    list: []
  }
);

export const customerActivitiesTrade = handleActions(
  {
    [GET_CUSTOMER_ACTIVITIES_TRADE]: (state, { payload }) => {
      if (payload.pager === 1) return payload;
      return {
        ...state,
        ...payload,
        list: state.list.concat(payload.list)
      };
    },
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => ({
      list: []
    })
  },
  {
    list: []
  }
);

export const customerActivitiesFollow = handleActions(
  {
    [GET_CUSTOMER_ACTIVITIES_FOLLOW]: (state, { payload }) => {
      if (payload.pager === 1) return payload;
      return {
        ...state,
        ...payload,
        list: state.list.concat(payload.list)
      };
    },
    [CLEAR_CUSTOMER_DETAIL_INFO]: () => ({
      list: []
    })
  },
  {
    list: []
  }
);

//

export const customerFormFields = handleActions(
  {
    [GET_CUSTOMER_FORM_FIELDS]: (state, { payload }) => payload
  },
  []
);

export const customerLinkSource = handleActions(
  {
    [GET_CUSTOMER_LINK_SOURCE]: (state, { payload }) => payload
  },
  []
);

export const customerShowcolumns = handleActions(
  {
    [GET_CUSTOMER_COLUMNS]: (state, { payload }) => {
      const copydata = [];
      payload.forEach(item => {
        if (item.show) {
          if (['recommendedCustomerNum'].includes(item.key)) {
            item.label = i18n[`customer.fields.${item.key}`];
          }
          copydata.push(item);
        }
      });
      return copydata;
    }
  },
  []
);

export const customerSearchSource = handleActions(
  {
    [GET_CUSTOMER_SOURCE]: (state, { payload }) => {
      const copyData = payload.concat();
      copyData.unshift({
        label: i18n['customer.advanced_search.field.all_customSource'],
        value: ''
      });
      return copyData;
    }
  },
  []
);

export const currentSource = handleActions(
  {
    [UPDATE_CURRENT_SOURCE]: (state, { type, payload }) => payload
  },
  { label: i18n['customer.advanced_search.field.all_customSource'], value: '' }
);

export const selectedItemsMap = handleActions(
  {
    [UPDATE_SELECTED_ITEMS]: (state, { payload }) => payload,
    [DELETE_CUSTOMERS]: () => ({}),
    [DEVIDE_CUSTOMERS]: () => ({})
  },
  {}
);

export const customersList = handleActions(
  {
    [GET_CUSTOMERS]: (state, { payload }) => {
      return payload.list;
    }
  },
  []
);

export const customerColumns = handleActions(
  {
    [GET_CUSTOMER_COLUMNS]: (state, { payload }) => payload
  },
  []
);
// 客户归属
export const searchType = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      const parsed = getParsedSearchTypes(payload);
      return parsed.find(item => item.value === 'all') || parsed[0] || {};
    },
    [UPDATE_SEARCH_TYPE]: (state, { payload }) => payload
  },
  {}
);
const defaultDateRange = {
  startDate: __dateRange__.all.start,
  endDate: __dateRange__.all.end
};
//时间范围
export const dateRange = handleActions(
  {
    [UPDATE_DATE_RANGE]: (state, { type, payload }) => payload,
    [UPDATE_SEARCH_TYPE]: () => defaultDateRange,
    [UPDATE_SEARCH_DATE]: () => defaultDateRange
  },
  defaultDateRange
);

export const fuzzySearchType = handleActions(
  {
    [UPDATE_FUZZY_SEARCH_TYPE]: (state, action) => action.payload
  },
  FUZZY_SEARCH_TYPES[0]
);

export const fuzzySearchText = handleActions(
  {
    [UPDATE_FUZZY_SEARCH_TEXT]: (state, action) => {
      return action.payload;
    },
    [UPDATE_SEARCH_TYPE]: (state, { payload }) => ''
  },
  ''
);

const defaultSortParam = {
  sortBy: 'CreateTime',
  orderDesc: true
};
export const currentSortParam = handleActions(
  {
    [UPDATE_CURRENT_SORT_PARAM]: (state, { type, payload }) => payload,
    [UPDATE_SEARCH_TYPE]: (state, { payload }) => defaultSortParam,
    [UPDATE_DATE_RANGE]: (state, { type, payload }) => defaultSortParam
  },
  defaultSortParam
);

export const currentCondition = handleActions(
  {
    [UPDATE_CONDITION]: (state, { type, payload }) => payload
  },
  ''
);

const defaultSearchDate = CUSTOMER_TIME_SEARCH_TYPE.find(
  item => item.value === 'CreateTime'
);
export const searchDate = handleActions(
  {
    [UPDATE_SEARCH_DATE]: (state, { type, payload }) => {
      return payload;
    },
    [UPDATE_SEARCH_TYPE]: (state, { payload }) => defaultSearchDate
  },
  defaultSearchDate
);

export const paginationInfo = handleActions(
  {
    [UPDATE_PAGENATION_INFO]: (state, { payload }) => {
      const size = Number(payload['pageSize']);
      if (payload['pageSize'] && getPageSize() !== size) {
        setPageSize(size);
      }
      return {
        ...state,
        currentPage: payload.currentPage,
        pageSize: size
      };
    },
    [UPDATE_PAGENATION_TOTAL]: (state, { payload }) => ({
      ...state,
      total: payload
    }),
    [UPDATE_SEARCH_TYPE]: (state, { payload }) => ({
      ...state,
      currentPage: 1
    }),
    [UPDATE_STATE_TYPE]: (state, { payload }) => ({
      ...state,
      currentPage: 1
    }),
    [UPDATE_SEARCH_DATE]: (state, { payload }) => ({
      ...state,
      currentPage: 1
    }),
    [UPDATE_DATE_RANGE]: (state, { payload }) => ({
      ...state,
      currentPage: 1
    }),
    [UPDATE_FIELD_CONDITIONS]: (state, { payload }) => ({
      ...state,
      currentPage: 1
    }),
    [UPDATE_ADVANCED_LOGIC_TYPE]: (state, { payload }) => ({
      ...state,
      currentPage: 1
    }),
    [UPDATE_CURRENT_SOURCE]: (state, { payload }) => ({
      ...state,
      currentPage: 1
    }),
    [DO_FUZZY_SEARCH]: (state, { payload }) => ({
      ...state,
      currentPage: 1
    })
  },
  {
    currentPage: 1,
    pageSize: getPageSize(),
    total: 0
  }
);

export const customerDetailModalInfo = handleActions(
  {
    [SHOW_CUSTOMER_DETAIL_MODAL]: (state, { payload }) => payload
  },
  {
    showAddCustomer: false,
    showModCustomer: false
  }
);

export const showCustomerCard = handleActions(
  {
    [SHOW_CUSTOMER_CARD]: (state, { payload }) => payload
  },
  false
);
// 可选的 searchtype
export const searchTypes = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) =>
      getParsedSearchTypes(payload)
  },
  []
);

export const followWayOptions = handleActions(
  {
    [GET_FOLLOW_WAY_OPTIONS]: (state, { payload }) => {
      let s = [];
      for (let item of payload) {
        if (item.key !== 'followWay') continue;
        s = item.optionList;
        break;
      }
      return s;
    }
  },
  []
);

//tw开通信息
export const productInfo = handleActions(
  {
    [GET_PRODUCT_INFO]: (state, { type, payload }) => payload
  },
  false
);

export const advancedLogicType = handleActions(
  {
    [UPDATE_ADVANCED_LOGIC_TYPE]: (state, { type, payload }) => payload
  },
  'AND'
);

export const advancedSearchConditions = handleActions(
  {},
  ADVANCED_SEARCH_CONDITIONS
);

export const advancedSearchType = handleActions(
  {
    [GET_CUSTOMER_FORM_FIELDS]: (state, { payload }) => {
      const types = getAdvancedSearchTypes(state, payload);

      return [...state, ...types].sort((a, b) => a.index - b.index);
    },
    [GET_FOLLOW_WAY_OPTIONS]: (state, { payload }) => {
      const types = getAdvancedSearchTypes(state, payload);

      return [...state, ...types].sort((a, b) => a.index - b.index);
    },
    [GET_CONTACTS_FORM_COLUMNS]: (state, { payload }) => {
      const types = getAdvancedSearchTypes(state, payload);

      return [...state, ...types].sort((a, b) => a.index - b.index);
    },
    [TOGGLE_FIELD_ENABLE]: (state, { payload }) => {
      const types = state.concat();
      const newTypes = types.map(item => {
        if (payload[item.value] !== undefined) {
          return { ...item, disabled: !payload[item.value] };
        }
        return item;
      });
      return newTypes;
    }
  },
  []
);

export const selectedAdvancedSearchConditions = handleActions(
  {
    [UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS]: (state, { type, payload }) =>
      payload
  },
  []
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

export const customerSource = handleActions(
  {
    [GET_CUSTOMER_SOURCE]: (state, { type, payload }) => payload
  },
  []
);

export const tenantType = handleActions(
  {
    [GET_TENANT_TYPE]: (state, { type, payload }) => {
      return payload === true ? 'inner' : 'outer';
    }
  },
  ''
);
export const customerStates = handleActions(
  {
    [GET_TENANT_TYPE]: (state, { type, payload }) => {
      return CUSTOMER_STATE_TYPES[payload === true ? 'inner' : 'outer'];
    }
  },
  CUSTOMER_STATE_TYPES['outer']
);

export const selectableCustomerStateKeys = handleActions(
  {
    [GET_TENANT_TYPE]: (state, { type, payload }) => {
      return payload === true
        ? SELECTABLE_CUSTOMER_STATE_KEYS['inner']
        : SELECTABLE_CUSTOMER_STATE_KEYS['outer'];
    }
  },
  SELECTABLE_CUSTOMER_STATE_KEYS['outer']
);

export const currentCustomerState = handleActions(
  {
    [UPDATE_STATE_TYPE]: (state, { type, payload }) => payload,
    [GET_TENANT_TYPE]: (state, { type, payload }) => {
      return CUSTOMER_STATE_TYPES[payload === true ? 'inner' : 'outer'][0];
    }
  },
  CUSTOMER_STATE_TYPES['outer'][0]
);

export const accountOwnerInfo = handleActions(
  {
    [GET_ACCOUNT_OWNER_OF_CUSTOMER_BY_ID]: (state, { type, payload }) => payload
  },
  {}
);

export const removeReasons = handleActions(
  {
    [GET_DELETE_REASON]: (state, { type, payload }) => payload
  },
  []
);

export const isAdaptOn = handleActions(
  {
    [GET_IS_ADAPT_ON]: (state, { type, payload }) => payload
  },
  false
);

export const listUpdateTime = handleActions(
  {
    [UPDATE_UPDATE_TIME]: (state, { payload }) => payload
  },
  ''
);

function getSearchTypes(rights) {
  const types = [];
  let addSearchAll = false;
  if (rights['CUSTOMER_SELECT_ALL']) {
    addSearchAll = true;
    types.push({
      label: i18n['customer.search_type.all'],
      value: 'all'
    });
  }
  if (rights['CUSTOMER_SELECT_DIRECTLY']) {
    types.push({
      label: i18n['customer.search_type.direct'],
      value: 'direct'
    });
  }
  if (rights['CUSTOMER_SELECT_SUBORDINATE']) {
    types.push({
      label: i18n['customer.search_type.no_direct'],
      value: 'noDirect'
    });
  }
  if (rights['CUSTOMER_SELECT_WILD']) {
    types.push({
      label: i18n['customer.search_type.no_belonging'],
      value: 'noBelonging'
    });
  }
  if (types.length >= 2 && !addSearchAll) {
    types.unshift({
      label: i18n['customer.search_type.all'],
      value: 'all'
    });
  }
  types.push({
    label: i18n['customer.search_type.followed'],
    value: 'followed'
  });
  return types;
}

function getAdvancedSearchTypes(state, payload) {
  const types = ADVANCED_SEARCH_TYPE.map((item, i) => ({
    ...item,
    index: i
  })).filter(type => {
    return (
      (type.default || payload.some(item => item.key === type.key)) &&
      !state.some(item => item.value === type.value)
    );
  });
  return types.map(type => {
    if (type.fieldType === 'select') {
      type.optionList =
        (payload.find(item => item.key === type.key) || {}).optionList ||
        type.optionList;
    }
    //新增的字段label根据sc配置获取
    if (!type.label) {
      type.label =
        payload.find(item => item.key === type.key) &&
        payload.find(item => item.key === type.key).label;
    }

    return type;
  });
}

function getParsedSearchTypes(userRight) {
  let hasAll = false;
  let allItem;
  const parsed = ACTION_BAR_SEARCH_TYPE.concat().filter(item => {
    if (!item.right) return true;
    if (!allItem && item.value === 'all') allItem = item;
    if (!hasAll && userRight[item.right] && item.value === 'all') hasAll = true;
    return userRight[item.right];
  });
  if (parsed.length > 1 && !hasAll) {
    const _allType = ACTION_BAR_SEARCH_TYPE.concat().find(
      item => item.value === 'all'
    );
    parsed.unshift(_allType);
  }
  return parsed;
}

export const ownId = handleActions(
  {
    [UPDATE_OWN_ID]: (state, { type, payload }) => payload,
    [UPDATE_STATE_TYPE]: () => ''
  },
  ''
);

export const accountOwnerFormColumns = handleActions(
  {
    [GET_ACCOUNT_OWNER_FORM_COLUMNS]: (state, { type, payload }) => payload
  },
  {
    t_account_profiles: [],
    t_account_finacial: [],
    t_account_id_info: []
  }
);

export const checkImportContentResult = handleActions(
  {
    [CHECK_IMPORT_CONTENT_SUCCESS]: (state, { payload }) => payload
  },
  {}
);

export const importFile = handleActions(
  {
    [SELECT_IMPORT_FILE]: (state, { payload }) => payload
  },
  {}
);

export const importResult = handleActions(
  {
    [EXECUTE_IMPORT]: (state, { payload }) => payload
  },
  {}
);

export const approveFieldsMap = handleActions({}, APPROVE_FIELDS_MAP);

export const approverInfo = handleActions(
  {
    [CHANGE_DEFAULT_APPROVER_INFO]: (state, { payload }) => payload
  },
  {}
);

export const bwBindUserDirectCount = handleActions(
  {
    [GET_BIND_BW_USER_DIRECT_USER_COUNT]: (state, { payload }) => payload
  },
  0
);
