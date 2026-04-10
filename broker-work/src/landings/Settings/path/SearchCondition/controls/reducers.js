import { handleActions } from 'redux-actions';
import { combineReducers } from 'redux';
import i18n from 'utils/i18n';
import { deepCopy } from 'utils/simpleDeepCopy';

import {
  GET_CONDITIONS_LIST,
  GET_CUSTOMER_FORM_FIELDS,
  GET_CUSTOMER_SOURCE,
  UPDATE_CONDITION_NAME,
  UPDATE_CONDITION_ROLE,
  GET_ROLE_LIST,
  GET_USER_GROUP_LIST,
  GET_LEVERAGE_LIST,
  GET_MT_GROUP_LIST,
  GET_SERVER_LIST,
  UPDATE_CURRENT_SERVER,
  CLEARN_CONDITION_DETAIL,
  GET_FORM_COLUMNS_ACCOUNT,
  GET_FOLLOW_WAY_OPTIONS,
  GET_SERVER_SYMBOLS,
  UPDATE_CURRENT_STATISTICAL_REPROT_TYPE
} from './actions';

import {
  GET_CONDITIONS_LIST_DETAIL,
  GET_CURRENT_USER_RIGHT
} from 'commonActions/actions';

import {
  ADVANCED_SEARCH_CONDITIONS,
  NEEDLESS_FIELD,
  DEFAULT_CONDITIONS
} from '../constant';

import { ADVANCED_SEARCH_TYPE as ADVANCED_SEARCH_TYPE_ACCOUNT } from '../../../../NewAccountmgmt/path/List/constant';
import { ADVANCED_SEARCH_TYPE as ADVANCED_SEARCH_TYPE_CUSTOMER } from '../../../../Custommgmt/path/Customers/constant';
import {
  ACCOUNTSUMMARY_HEADER,
  ACCOUNTDW_HEADER,
  POSITION_HEADER,
  ORDER_HEADER,
  HISTORYORDER_HEADER,
  STOP_LOSS_HEADER,
  SYMBOL_HEADER,
  NEW_USER_HEADER,
  REPORT_ADVANCED_SEARCH_CONDITIONS_EXTRA_FIELD,
  STATISTICAL_REPORT_TYPE
} from '../../../../Reportmgmt/constant.js';

export const conditionsList = handleActions(
  {
    [GET_CONDITIONS_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const conditionDetail = handleActions(
  {
    [GET_CONDITIONS_LIST_DETAIL]: (state, { type, payload }) => payload,
    [CLEARN_CONDITION_DETAIL]: () => ({})
  },
  {}
);

export const currentConditionsName = handleActions(
  {
    [UPDATE_CONDITION_NAME]: (state, { type, payload }) => payload
  },
  ''
);

export const currentRole = handleActions(
  {
    [UPDATE_CONDITION_ROLE]: (state, { type, payload }) => payload
  },
  []
);

// 条件选择
export const customerFormFields = handleActions(
  {
    [GET_CUSTOMER_FORM_FIELDS]: (state, { payload }) => payload
  },
  []
);

export const customerSource = handleActions(
  {
    [GET_CUSTOMER_SOURCE]: (state, { type, payload }) => payload
  },
  []
);

//组合上级角色信息
const parseRoleListData = roleList => {
  const copyData = roleList.concat();
  let roleData = [
    { label: i18n['settings.conditions_setting.all_role'], value: 'all' }
  ];
  copyData.forEach(role => {
    roleData.push({ label: role.name, value: role.id });
  });
  return roleData;
};

//获取角色列表
export const roleList = handleActions(
  {
    [GET_ROLE_LIST]: (state, { type, payload }) => parseRoleListData(payload)
  },
  []
);

// 账户 start

const parseServerListData = serverList => {
  const copyData = serverList.concat();

  return copyData.map(server => {
    return {
      label: server.desc,
      value: {
        serverId: server.serverId,
        vendor: server.vendor
      }
    };
  });
};

export const currentServer = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) =>
      parseServerListData(payload)[0],
    [UPDATE_CURRENT_SERVER]: (state, { type, payload }) => payload
  },
  {}
);

export const mtGroupList = handleActions(
  {
    [GET_MT_GROUP_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const userGroupList = handleActions(
  {
    [GET_USER_GROUP_LIST]: (state, { type, payload }) => {
      return payload.map(item => {
        return {
          ...item,
          label: item.groupName || '',
          value: item.id
        };
      });
    }
  },
  []
);

export const leverageList = handleActions(
  {
    [GET_LEVERAGE_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const serverList = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) =>
      parseServerListData(payload)
  },
  []
);

export const advancedSearchTypeAccount = handleActions(
  {
    [GET_FORM_COLUMNS_ACCOUNT]: (state, { type, payload }) => {
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
    }
  },
  ADVANCED_SEARCH_TYPE_ACCOUNT
);

//账户end

//客户start

function getCustomerAdvancedSearchTypes(state, payload) {
  const types = ADVANCED_SEARCH_TYPE_CUSTOMER.filter(type => {
    return (
      (type.default || payload.some(item => item.key === type.key)) &&
      !state.some(item => item.value === type.value)
    );
  });
  return types.map(type => {
    if (type.fieldType === 'select') {
      const key = payload.find(item => item.key === type.key);
      type.optionList = key && key.optionList ? key.optionList : [];
    }

    return type;
  });
}

export const advancedSearchTypeCustomer = handleActions(
  {
    [GET_CUSTOMER_FORM_FIELDS]: (state, { payload }) => {
      const types = getCustomerAdvancedSearchTypes(state, payload);
      return [...state, ...types].sort((a, b) => a.index - b.index);
    },
    [GET_FOLLOW_WAY_OPTIONS]: (state, { payload }) => {
      const types = getCustomerAdvancedSearchTypes(state, payload);
      return [...state, ...types].sort((a, b) => a.index - b.index);
    }
  },
  []
);

const reportFieldMap = {
  AccountSummary: ACCOUNTSUMMARY_HEADER,
  AccountDw: ACCOUNTDW_HEADER,
  Position: POSITION_HEADER,
  Order: ORDER_HEADER,
  HistoryOrder: HISTORYORDER_HEADER,
  SymbolGroup: SYMBOL_HEADER,
  StopLimit: STOP_LOSS_HEADER,
  NewUser: NEW_USER_HEADER
};
// 整理生成条件的数据，使用的时候要对服务器处理
function getReportAdvancedSearchTypes(state, payload) {
  const matched = reportFieldMap[payload];
  if (!matched) return [];
  const types = deepCopy(matched).filter(item => item.fieldType);
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
    }
    return type;
  });
  const newTypes = types.concat(REPORT_ADVANCED_SEARCH_CONDITIONS_EXTRA_FIELD);
  return newTypes;
}

export const advancedSearchTypeReport = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      const matched = STATISTICAL_REPORT_TYPE.concat().filter(
        item => payload[item.right]
      )[0];
      if (matched) {
        return getReportAdvancedSearchTypes(state, matched.value);
      } else {
        return [];
      }
    },
    [UPDATE_CURRENT_STATISTICAL_REPROT_TYPE]: (state, { type, payload }) => {
      const types = getReportAdvancedSearchTypes(state, payload.value);
      return types;
    }
  },
  []
);

//更新当前账户报表类型
export const currentStatisticalReportType = handleActions(
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

//账户报表类型
export const statisticalReportTypeList = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { type, payload }) => {
      return STATISTICAL_REPORT_TYPE.concat().filter(
        item => payload[item.right]
      );
    }
  },
  []
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
