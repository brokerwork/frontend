import { handleActions } from 'redux-actions';
import { get as __getPageSize__, set as __setPageSize__ } from 'utils/pageSize';
import moment from 'moment';
import { dateRange } from 'utils/config';
import { SEARCH_TYPES, ADVANCED_SEARCH_CONDITIONS } from '../constants';
import { MESSAGE_TYPES } from '../../Msgmgmt/constant';
import { GET_CURRENT_USER_RIGHT } from 'commonActions/actions';
import {
  GET_USERS,
  MODIFY_PARAMS,
  UPDATE_SELECTED_USERS,
  GET_USER_INFO,
  UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS,
  UPDATE_ADVANCED_LOGIC_TYPE,
  UPDATE_UPDATE_TIME,
  UPDATE_FIELD_CONDITIONS,
  GET_ACCESS_CONF,
  GET_LEVEL_RELATIONS_LIST,
  GET_PASSWORD_STRENGTH,
  GET_SERVER_LIST
} from './actions';
import { getType as getLanguageType } from 'utils/language';
let lang = getLanguageType();
if (lang === 'ar-AE') {
  lang = 'ar-tn';
}
moment.locale(lang);
const pageSizeKey = 'ta_user_mgmt_';
const DEFAULT_SEARCH_PARAMS = {
  startDate: dateRange.all.start,
  endDate: dateRange.all.end,
  page: 1,
  size: __getPageSize__(pageSizeKey),
  value: '',
  sort: 'registerTime',
  order: 'DESC',
  userName: '',
  phone: ''
};

export const users = handleActions(
  {
    [GET_USERS]: (state, { type, payload }) => payload.list
  },
  []
);

export const params = handleActions(
  {
    [MODIFY_PARAMS]: (state, { type, payload }) => (payload ? payload : state),
    [UPDATE_FIELD_CONDITIONS]: (state, { payload }) => {
      const newParams = {
        phone: '',
        userName: '',
        startDate: dateRange.last30days.start,
        endDate: dateRange.last30days.end
      };
      payload.forEach(item => {
        if (item.field === 'phone') {
          newParams.phone = item.value;
        }
        if (item.field === 'userName') {
          newParams.userName = item.value;
        }
        if (item.field === 'registerTime') {
          const { startDate, endDate } = item.value;
          newParams.startDate = startDate;
          newParams.endDate = endDate;
        }
      });
      return {
        ...state,
        ...newParams
      };
    }
  },
  DEFAULT_SEARCH_PARAMS
);

export const paginationInfo = handleActions(
  {
    [GET_USERS]: (state, { payload }) => {
      const size = payload.size;
      return {
        pageNo: payload.pager,
        pageSize: size,
        total: payload.total
      };
    }
  },
  {
    pageNo: 0,
    pageSize: 0,
    total: 0
  }
);

export const selectedUsers = handleActions(
  {
    [UPDATE_SELECTED_USERS]: (state, { type, payload }) => payload
  },
  {}
);

export const typesOptions = handleActions(
  {
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      return MESSAGE_TYPES.filter(item => {
        return ['MAIL', 'SMS', 'WEB', 'WEB_ALERT'].includes(item.value);
      }).filter(item => {
        if (item.value === 'ALL') return false;
        return payload[item.right];
      });
    }
  },
  []
);

export const userInfo = handleActions(
  {
    [GET_USER_INFO]: (state, { payload }) => {
      return {
        ...payload,
        tradeAccounts:
          payload.tradeAccounts &&
          payload.tradeAccounts.map(item => {
            let bindTime = item.bindTime;
            if (bindTime) {
              const timeLen = `${bindTime}`.length;
              bindTime = timeLen === 10 ? bindTime * 1000 : bindTime;
            }
            return { ...item, bindTime };
          })
      };
    }
  },
  {}
);

export const advancedSearchConditions = handleActions(
  {},
  ADVANCED_SEARCH_CONDITIONS
);

export const selectedAdvancedSearchConditions = handleActions(
  {
    [UPDATE_SELECTED_ADVANCED_SEARCH_CONDITIONS]: (state, { type, payload }) =>
      payload
  },
  { AND: [], OR: [] }
);

export const advancedLogicType = handleActions(
  {
    [UPDATE_ADVANCED_LOGIC_TYPE]: (state, { type, payload }) => payload
  },
  'AND'
);

// 列表更新时间
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
  [
    {
      condition: 'BETWEEN',
      field: 'registerTime',
      value: {
        startDate: dateRange.all.start,
        endDate: dateRange.all.end
      },
      originValue: {
        startDate: dateRange.all.start,
        endDate: dateRange.all.end
      }
    }
  ]
);
export const accessConfig = handleActions(
  {
    [GET_ACCESS_CONF]: (state, { payload }) => payload
  },
  {}
);
export const levelRelationLists = handleActions(
  {
    [GET_LEVEL_RELATIONS_LIST]: (state, { payload }) => payload
  },
  {}
);
// 密码强度
export const password_strength = handleActions(
  {
    [GET_PASSWORD_STRENGTH]: (state, { type, payload }) => payload
  },
  {}
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
export const demoServerList = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) =>
      parseServerListData(payload)
  },
  []
);
