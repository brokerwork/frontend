import { handleActions } from 'redux-actions';
import { dateRange } from 'utils/config';
import i18n from 'utils/i18n';
import { get as __getPageSize__, set as __setPageSize__ } from 'utils/pageSize';
import { GET_CURRENT_USER_RIGHT } from 'commonActions/actions';
import { MESSAGE_TYPES } from '../../../../Msgmgmt/constant';
import {
  ADVANCED_SEARCH_TYPE,
  ADVANCED_SEARCH_TIME_TYPE,
  ADVANCED_SEARCH_CONDITIONS
} from '../../../../Usermgmt/constant';
import {
  GET_USER_LEVEL,
  MODIFY_PARAMS,
  GET_LIST_DATA,
  SELECT_USER,
  GET_ALL_USER,
  GET_SUPERIOR_USERS,
  CLEAR_SUPERIOR_USERS,
  GET_USER_ROLE,
  GET_SERVER_LIST,
  GET_UPDATE_USER_LEVEL,
  GET_PARENTS,
  GET_PASSWORD_STRENGTH,
  GET_USER_INFO,
  SET_USER_INFO,
  GET_UPWARD_RETURN,
  GET_RULE_DETAIL,
  GET_LIST_COLUMNS,
  GET_FORM_COLUMNS,
  GET_OWN_CUSTOMER_AND_ACCOUNT,
  CLEAR_USER_INFO,
  GET_ACCOUNT_DROPDOWN_DATA,
  GET_LOGIN_NO_RANGE,
  GET_LEVEL_BY_USER_ID,
  UPDATE_FIELD_CONDITIONS,
  UPDATE_SEARCH_TYPE,
  UPDATE_UPDATE_TIME
} from './actions';

const pageSizeKey = 'user_list';
const getPageSize = __getPageSize__.bind(this, pageSizeKey);
const setPageSize = __setPageSize__.bind(this, pageSizeKey);
const idForNames = [{ key: 'roleId', for: 'roleName' }];

const userRightHandle = payload => {
  const __arr = [];
  let displayAll = false;
  //所有用户
  if (payload['USER_SELECT_ALL']) {
    __arr.push({
      label: i18n['usermgmt.user_search_type.all'],
      value: 'allSee'
    });
    displayAll = true;
  }
  //我的直属
  if (payload['USER_SELECT_DIRECTLY']) {
    __arr.push({ label: i18n['usermgmt.user_search_type.sub'], value: 'sub' });
  }
  //我的下级
  if (payload['USER_SELECT_SUBORDINATE']) {
    __arr.push({
      label: i18n['usermgmt.user_search_type.sub_be_long'],
      value: 'subBelong'
    });
  }
  //无归属
  if (payload['USER_SELECT_WILD']) {
    __arr.push({
      label: i18n['usermgmt.user_search_type.no_parent'],
      value: 'noParent'
    });
  }

  //没有所有用户的权限,但有两个以上的权限时,添加全部选项
  if (!displayAll && __arr.length >= 2) {
    __arr.unshift({
      label: i18n['usermgmt.user_search_type.all'],
      value: 'allSee'
    });
  }
  return __arr;
};

export const options = handleActions(
  {
    //权限
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      const __arr = userRightHandle(payload);
      return {
        ...state,
        userSearchType: __arr
      };
    },
    //用户层级选项
    [GET_USER_LEVEL]: (state, { type, payload }) => {
      return {
        ...state,
        level: payload
      };
    }
  },
  {
    userSearchType: [],
    level: []
  }
);

export const typesOptions = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      return MESSAGE_TYPES.filter(item => {
        if (item.value === 'ALL') return false;
        return payload[item.right];
      });
    }
  },
  []
);

export const params = handleActions(
  {
    [MODIFY_PARAMS]: (state, { payload }) => (payload ? payload : state),
    // 得到权限后更新初始化选择数据
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      const __arr = userRightHandle(payload);
      return {
        ...state,
        userSearchType: __arr[0]
      };
    },
    [UPDATE_FIELD_CONDITIONS]: (state, { payload }) => {
      const newParams = {
        levelId: '',
        userSearchType: {},
        startDate: dateRange.all.start.valueOf(),
        endDate: dateRange.all.end.valueOf(),
        userId: undefined,
        advanceConditions: []
      };
      const newConditions = [];
      payload.forEach(item => {
        if (item.field === 'filterDate') {
          const { startDate, endDate } = item.value;
          newParams.startDate = startDate.valueOf();
          newParams.endDate = endDate.valueOf();
        } else if ('userSearchType' === item.field) {
          newParams['userSearchType'] = item.originValue[0];
          newParams['userId'] = item.originValue[1]; // item.originValue {label,  value} 值
        } else {
          newConditions.push(item); // item.value:  value值
        }
      });
      newParams.advanceConditions = newConditions;
      if (
        !newParams.userId &&
        !(newParams.userSearchType && newParams.userSearchType.value)
      ) {
        newParams.userSearchType = state.userSearchType;
      }
      return {
        ...state,
        ...newParams
      };
    }
  },
  {
    sortby: 'createDate',
    orderDesc: true,
    pageNo: 1,
    size: getPageSize(),
    startDate: dateRange.all.start.valueOf(),
    endDate: dateRange.all.end.valueOf(),
    queryContent: '',
    levelId: undefined,
    userSearchType: {},
    advanceConditions: []
  }
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
    [GET_LIST_DATA]: (state, { payload }) => {
      const size = payload['size'];
      if (payload['size'] && getPageSize() !== size) {
        setPageSize(size);
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

//已经选择的用户
export const selectedUsers = handleActions(
  {
    [SELECT_USER]: (state, { payload }) => payload
  },
  {}
);

//表格数据
export const listData = handleActions(
  {
    [GET_LIST_DATA]: (state, { payload }) => {
      return payload.list || [];
    },
    [GET_OWN_CUSTOMER_AND_ACCOUNT]: (state, { payload }) => {
      return state.map(item => {
        return {
          ...item,
          ownAccounts: (payload.account && payload.account[item.id]) || 0,
          ownCustomers: (payload.customer && payload.customer[item.id]) || 0
        };
      });
    }
  },
  []
);

//聚合数据
export const optionsObject = handleActions(
  {
    [GET_USER_LEVEL]: (state, { payload }) => {
      const __obj = {};
      payload.forEach(item => {
        __obj[item.value] = item.label;
      });
      return {
        ...state,
        level: __obj
      };
    },
    [GET_ALL_USER]: (state, { payload }) => {
      const __obj = {};
      payload.forEach(item => {
        __obj[item.id] = item.name;
      });
      return {
        ...state,
        superior: __obj
      };
    }
  },
  {
    level: {},
    superior: {}
  }
);

//上级列表
export const superiorUsers = handleActions(
  {
    [GET_SUPERIOR_USERS]: (state, { payload }) => payload,
    [CLEAR_SUPERIOR_USERS]: () => []
  },
  []
);

//组合所属服务器信息
const parseServerListData = serverList => {
  const copyData = serverList.concat();

  return copyData.map(server => {
    return {
      ...server,
      label: server.desc,
      value: server.serverId
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

//组合上级角色信息
const parseRoleListData = roleList => {
  const copyData = roleList.concat();

  return copyData.map(role => {
    return {
      label: role.name,
      value: role.id
    };
  });
};

//获取角色列表
export const role_list = handleActions(
  {
    [GET_USER_ROLE]: (state, { type, payload }) => parseRoleListData(payload)
  },
  []
);

//组合层级信息
const parseLevelData = LevelList => {
  const copyData = LevelList.concat();

  return copyData.map(level => {
    return {
      ...level,
      label: level.name,
      value: level.id
    };
  });
};

// 层级信息
export const level_list = handleActions(
  {
    [GET_UPDATE_USER_LEVEL]: (state, { type, payload }) =>
      parseLevelData(payload)
  },
  []
);

// 聚合action_bar层级信息
export const UserActionbarLevelList = handleActions(
  {
    [GET_UPDATE_USER_LEVEL]: (state, { type, payload }) => {
      const __arr = [{ label: i18n['usermgmt.level.all_level'], value: 'all' }];
      payload.forEach(level => {
        __arr.push({ label: level.name, value: level.id });
      });
      return __arr;
    }
  },
  []
);

//组合上级用户信息
const parseParentsData = parentsList => {
  const copyData = parentsList.concat();

  return copyData.map(item => {
    const levelTag = item.levelName ? `(${item.levelName})` : '';
    return {
      label: `${item.name}（${item.entityNo}）${levelTag}`,
      value: item.id
    };
  });
};

// 上级用户下拉options
export const parents_list = handleActions(
  {
    [GET_PARENTS]: (state, { type, payload }) => parseParentsData(payload)
  },
  []
);

// 密码强度
export const password_strength = handleActions(
  {
    [GET_PASSWORD_STRENGTH]: (state, { type, payload }) => payload
  },
  {}
);

//裁剪用户信息
const spliceData = data => {
  return data['userInfo'];
};

//当前编辑用户的用户信息
export const edit_user_info = handleActions(
  {
    [GET_USER_INFO]: (state, { type, payload }) => spliceData(payload),
    // [CLEAR_USER_INFO]: () => ({}),
    [SET_USER_INFO]: (state, { payload }) => ({ ...state, ...payload })
  },
  {}
);

//当前用户所属范围标记
export const relation_user_info = handleActions(
  {
    [GET_USER_INFO]: (state, { type, payload }) => payload['relation']
  },
  ''
);

const getForm = data => {
  return data['_formArr'];
};
//返佣规则
export const up_ward_form = handleActions(
  {
    [GET_UPWARD_RETURN]: (state, { type, payload }) => getForm(payload),
    [CLEAR_USER_INFO]: () => []
  },
  []
);

//返佣默认值
export const up_ward_initvalue = handleActions(
  {
    [GET_USER_INFO]: (state, { type, payload }) => {
      const commissionUserInfo = {};
      commissionUserInfo['levelId'] = payload['userInfo'].levelId || 0;
      commissionUserInfo['levelName'] = payload['userInfo'].levelName || null;
      commissionUserInfo['subUserCount'] =
        payload['userInfo'].subUserCount || 0;
      commissionUserInfo['parent'] = payload['userInfo'].parent || 0;
      commissionUserInfo['id'] = payload['userInfo'].id || 0;
      commissionUserInfo['submitFinally'] = payload['userInfo'];
      return {
        ...state,
        commissionUserInfo: commissionUserInfo
      };
    },
    [GET_UPWARD_RETURN]: (state, { type, payload }) => {
      const newLevelInfo = state.commissionUserInfo;
      const oldInitValues = state.commissionInitValues || {};
      const commissionInitValues = Object.assign(
        payload['_initValues'],
        newLevelInfo,
        payload._addition //说明非初始化情况。读取addition中的值。
          ? {
              levelId: oldInitValues.levelId,
              levelName: oldInitValues.levelName,
              parent: oldInitValues.parent
            }
          : {},
        payload._addition
      );
      return {
        ...state,
        commissionInitValues: commissionInitValues
      };
    },
    [CLEAR_USER_INFO]: () => ({})
  },
  {}
);

const getInput = data => {
  return data['_inputruleId'];
};

//输入类型的返佣规则，用于提交数据时聚合
export const up_ward_inputarr = handleActions(
  {
    [GET_UPWARD_RETURN]: (state, { type, payload }) => getInput(payload)
  },
  []
);

//返佣规则详情
export const rule_detail = handleActions(
  {
    [GET_RULE_DETAIL]: (state, { type, payload }) => payload
  },
  []
);

// 用户自定义表单
export const listColumns = handleActions(
  {
    [GET_LIST_COLUMNS]: (state, { type, payload }) => {
      idForNames.forEach(id => {
        const idx = payload.findIndex(col => col.key === id.key);

        if (idx !== -1) {
          payload[idx].key = id.for;
        }
      });
      return payload;
    }
  },
  []
);

// 用户表头显示表单
export const showlistColumns = handleActions(
  {
    [GET_LIST_COLUMNS]: (state, { type, payload }) => {
      idForNames.forEach(id => {
        const idx = payload.findIndex(col => col.key === id.key);

        if (idx !== -1) {
          payload[idx].key = id.for;
        }
      });
      const copydata = [];
      payload.forEach(item => {
        if (item.show) {
          copydata.push(item);
        }
      });
      return copydata;
    }
  },
  []
);

export const basicFormColumns = handleActions(
  {
    [GET_FORM_COLUMNS]: (state, { type, payload }) => {
      return (payload && payload.t_user_profiles) || [];
    }
  },
  []
);

export const moreFormColumns = handleActions(
  {
    [GET_FORM_COLUMNS]: (state, { type, payload }) => {
      return (payload && payload.t_user_agent) || [];
    }
  },
  []
);

export const accountFormColumns = handleActions(
  {
    [GET_FORM_COLUMNS]: (state, { type, payload }) => {
      const { t_account_cbroker, t_account_account } = payload;
      return {
        MT4: t_account_account,
        MT5: t_account_account,
        CTRADER: t_account_cbroker
      };
    }
  },
  {
    MT4: [],
    MT5: [],
    CTRADER: []
  }
);

// 账户信息下拉信息
export const accountDropdownData = handleActions(
  {
    [GET_ACCOUNT_DROPDOWN_DATA]: (state, { payload }) => {
      const {
        groupData = [],
        userGroupData = [],
        currencyData = [],
        serverId,
        ...others
      } = payload;
      const __userGroupData = userGroupData.map(item => {
        return {
          label: item.groupName || '',
          value: item.id
        };
      });
      const __GroupData = groupData.map(item => {
        return {
          label: item,
          value: item
        };
      });

      const __currencyData = currencyData.map(item => {
        return {
          label: item,
          value: item
        };
      });
      return {
        ...state,
        [serverId]: {
          ...others,
          userGroupData: __userGroupData,
          groupData: __GroupData,
          currencyData: __currencyData
        }
      };
    }
  },
  {}
);

export const loginNoRange = handleActions(
  {
    [GET_LOGIN_NO_RANGE]: (state, { type, payload }) => payload
  },
  {}
);

export const initLevelInfo = handleActions(
  {
    [GET_LEVEL_BY_USER_ID]: (state, { type, payload }) => {
      if (!payload) return payload;
      const levelTag = payload.levelName ? `(${payload.levelName})` : '';
      return {
        ...payload,
        label: `${payload.name}（${payload.entityNo}）${levelTag}`,
        value: payload.id
      };
    }
  },
  ''
);

export const advancedSearchType = handleActions(
  {
    [GET_LIST_COLUMNS]: (state, { payload }) => {
      const types = getAdvancedSearchTypes(state, payload);

      return [...state, ...types].sort((a, b) => a.index - b.index);
    }
  },
  []
);

export const advancedSearchConditions = handleActions(
  {},
  ADVANCED_SEARCH_CONDITIONS
);

export const searchFieldConditions = handleActions(
  {
    [UPDATE_FIELD_CONDITIONS]: (state, { type, payload }) => payload
  },
  []
);

function getAdvancedSearchTypes(state, payload) {
  const types = ADVANCED_SEARCH_TYPE.filter(type => {
    return (
      (type.default || payload.some(item => item.key === type.key)) &&
      !state.some(item => item.value === type.value)
    );
  });

  return types.map(type => {
    if (type.fieldType === 'select') {
      type.optionList = (
        payload.find(item => item.key === type.key) || {}
      ).optionList;
    }

    return type;
  });
}
