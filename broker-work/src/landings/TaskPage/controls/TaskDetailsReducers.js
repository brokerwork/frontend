import { handleActions } from 'redux-actions';
import i18n from 'utils/i18n';
import _ from 'lodash';

import {
  GET_DETAILS,
  GET_PRIORITY_OPTIONS,
  GET_TASK_MEMBERS,
  GET_ACCOUNT_FORM,
  CHANGE_ACCOUNT_FORM,
  GET_ACCOUNT_DATA,
  GET_ACCOUNT_DROPDOWN_DATA,
  GET_EXTERNAL_FORM_DATA,
  GET_TASK_DETAILS_LOG,
  GET_APPROVAL_PROCESS,
  CLEAR_DATA,
  GET_SERVER_PASSWORD_REGULAR,
  GET_SAME_ACCOUNT,
  GET_USER_ROLE,
  GET_SERVER_LIST,
  GET_PASSWORD_STRENGTH,
  GET_FORM_COLUMNS,
  GET_WITHDRAW_FORM_FIELD,
  GET_CTRADER_CURRENCY_BY_SERVER_ID,
  GET_SETTING_INFO,
  GET_WITHDRAW_CUSTOM_TYPE,
  GET_CURRENT_RATE,
  GET_ACCOUNT_INFO,
  GET_ACCOUNT_INFO_POSITION
} from './TaskDetailsActions';
import { VERIFY_IDENTITY } from './actions';
import { CUSTOMER_FIELDS_TO_ACCOUNT_OWNER } from '../contants';
export const details = handleActions(
  {
    [GET_DETAILS]: (state, { payload }) => payload,
    [VERIFY_IDENTITY]: (state, { payload }) => {
      const newState = {
        ...state,
        checkState: {
          ...state.checkState,
          ...payload
        }
      };
      return newState;
    }
  },
  {}
);

export const priorityOptions = handleActions(
  {
    [GET_PRIORITY_OPTIONS]: (state, { payload }) => payload
  },
  []
);

export const taskMembers = handleActions(
  {
    [CLEAR_DATA]: () => [],
    [GET_TASK_MEMBERS]: (state, { payload }) => payload
  },
  []
);

// 动态表单字段
export const formFields = handleActions(
  {
    [GET_ACCOUNT_FORM]: (state, { payload }) => payload
  },
  {
    t_account_profiles: [],
    t_account_id_info: [],
    t_account_finacial: [],
    t_account_account: []
  }
);
export const showFormFields = handleActions(
  {
    [GET_ACCOUNT_FORM]: (state, { payload }) => payload,
    [CHANGE_ACCOUNT_FORM]: (state, { payload }) => {
      return payload;
    }
  },
  {
    t_account_profiles: [],
    t_account_id_info: [],
    t_account_finacial: [],
    t_account_account: []
  }
);
// 表单数据
export const formData = handleActions(
  {
    [CLEAR_DATA]: () => ({ externalData: {}, comment: '' }),
    [GET_ACCOUNT_DATA]: (state, { payload }) => {
      console.log('payloadpayload', payload);
      // payload.vendor = 'CTRADER';
      let userId = '';
      if (
        payload.account &&
        payload.account.userId &&
        typeof payload.account.userId !== 'object'
      ) {
        userId = payload.account.userId;
      }
      const __account = Object.assign(
        {},
        {
          readOnly: '1',
          enable: '1'
        },
        payload.account || {}
      );
      __account['userId'] = userId;
      return {
        ...state,
        ...payload,
        account: __account
      };
    },
    [GET_EXTERNAL_FORM_DATA]: (state, { payload }) => {
      // 转换杠杆可选信息为键值对
      if (payload.leverage) {
        const __leverage = {};
        payload.leverage.forEach(item => {
          __leverage[item.value] = item.label;
        });
        payload.leverage = __leverage;
      }
      // 提取name
      if (payload.customer) {
        payload.customerName = payload.customer.name;
        payload.customerData = payload.customer;
      }

      // 提取name 接口聚合后逻辑有变动 导致customerName有时候是string 有时候是object
      if (payload.customerName && payload.customerName.name) {
        payload.customerName = payload.customerName.name;
      }

      // 自定义字段信息从Array转换为object
      if (payload.fields) {
        let __fields = {};
        for (let k in payload.fields) {
          __fields[k] = {};
          payload.fields[k].forEach((item, index) => {
            if (
              k !== 't_customer_profiles' ||
              CUSTOMER_FIELDS_TO_ACCOUNT_OWNER.includes(item.key)
            ) {
              __fields[k][item.key] = item;
            }
          });
        }
        payload.fields = __fields;
      }

      // 处理账户归属查询返回信息
      if (payload.accountAttributionName) {
        const { name, roleName, entityNo, id } = payload.accountAttributionName;
        if (id) {
          payload.accountAttributionName = `${name} (${roleName}${
            entityNo ? `/${entityNo}` : ''
          })`;
        } else {
          payload.accountAttributionName = '';
        }
      }
      //处理客户来源中的数据
      if (payload.customSource) {
        payload.customSource = payload.customSource.customSource;
      }
      if (payload.accountForTask) {
        const { accounts } = payload.accountForTask;
        payload.accountForTask = {
          ...payload.accountForTask,
          accounts:
            accounts &&
            accounts.filter(
              item => item.balance < 0 || item.equity < 0 || item.marginFree < 0
            )
        };
      }
      if (payload.identical) {
        payload.identical = Object.keys(payload.identical).map(key => {
          return payload.identical[key];
        });
      }
      //fake data
      // payload.adapt = {
      //   result: 100,
      //   score: 88,
      //   totalScore: 88,
      //   time: new Date().getTime(),
      //   leverage: 400
      // };
      return {
        ...state,
        externalData: {
          ...state.externalData,
          ...payload
        }
      };
    }
  },
  {
    externalData: {},
    comment: ''
  }
);

// 账户信息下拉信息
export const accountDropdownData = handleActions(
  {
    [GET_ACCOUNT_DROPDOWN_DATA]: (state, { payload }) => {
      const {
        serverGroupsData = [],
        userGroupsData = [],
        currencyData = {}
      } = payload;
      const __userGroupsData = userGroupsData.map(item => {
        return {
          label: item.groupName || '',
          value: item.id
        };
      });
      const __serverGroupsData = serverGroupsData.map(item => {
        return {
          label: item.serverName,
          value: item.serverId,
          groups: item.groups
        };
      });
      const { serverId, data } = currencyData;

      const __currencyData =
        typeof serverId === 'undefined' || !data
          ? []
          : data.map(item => {
              return {
                label: item,
                value: item
              };
            });
      return {
        ...payload,
        serverGroupsData: __serverGroupsData,
        userGroupsData: __userGroupsData,
        currencyData: {
          ...state.currencyData,
          [serverId]: __currencyData
        }
      };
    },
    [GET_CTRADER_CURRENCY_BY_SERVER_ID]: (state, { payload }) => {
      const { serverId, data } = payload;
      if (typeof serverId === 'undefined' || !data) return state;
      const __currencyData = data.map(item => {
        return {
          label: item,
          value: item
        };
      });
      return {
        ...state,
        currencyData: {
          ...state.currencyData,
          [serverId]: __currencyData
        }
      };
    }
  },
  {
    serverGroupsData: [],
    userGroupsData: [],
    leverageData: [],
    currencyData: {}
  }
);

// 任务日志
export const log = handleActions(
  {
    [CLEAR_DATA]: () => ({}),
    [GET_TASK_DETAILS_LOG]: (_, { payload }) => payload
  },
  {}
);

// 审批流程
export const approvalProcess = handleActions(
  {
    [CLEAR_DATA]: () => ({}),
    [GET_APPROVAL_PROCESS]: (_, { payload }) => payload
  },
  {}
);

//主密码, 投资密码验证规则,
export const passwordRegular = handleActions(
  {
    [CLEAR_DATA]: () => ({}),
    [GET_SERVER_PASSWORD_REGULAR]: (state, { payload }) => {
      const __obj = {};
      payload.forEach((item, index) => {
        __obj[item.name] = {
          reg: new RegExp(`^[0-9a-zA-Z]{${item.passwordMinLength},}$`, 'i'),
          minLength: item.passwordMinLength
        };
      });
      return __obj;
    }
  },
  {}
);

export const sameAccounts = handleActions(
  {
    [GET_SAME_ACCOUNT]: (state, { payload }) => {
      return payload;
    }
  },
  []
);

export const roleList = handleActions(
  {
    [GET_USER_ROLE]: (state, { payload }) => {
      return payload.map(role => ({
        label: role.name,
        value: role.id
      }));
    }
  },
  []
);

//获取服务器列表
export const serverList = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) =>
      parseServerListData(payload)
  },
  []
);

// 密码强度
export const passwordStrength = handleActions(
  {
    [GET_PASSWORD_STRENGTH]: (state, { type, payload }) => payload
  },
  {}
);

//组合所属服务器信息
function parseServerListData(list) {
  const copyData = list.concat();

  return copyData.map(server => {
    return {
      label: `${server.desc}`,
      value: `${server.vendor}_${server.serverId}`
    };
  });
}

export const formColumns = handleActions(
  {
    [GET_FORM_COLUMNS]: (state, { type, payload }) => payload
  },
  []
);

export const withdrawFormField = handleActions(
  {
    [GET_WITHDRAW_FORM_FIELD]: (state, { type, payload }) => payload
  },
  []
);

export const settingInfo = handleActions(
  {
    [GET_SETTING_INFO]: (state, { type, payload }) => {
      return {
        MT4: {
          group: payload.groupId,
          leverage: payload.leverage,
          serverId: payload.serverId
        },
        MT5: {
          group: payload.groupId5,
          leverage: payload.leverage5,
          serverId: payload.serverId5
        },
        CTRADER: payload.cbroker
      };
    }
  },
  []
);

export const withdrawTypes = handleActions(
  {
    [GET_WITHDRAW_CUSTOM_TYPE]: (state, { type, payload }) => payload
  },
  []
);

export const currentRate = handleActions(
  {
    [GET_CURRENT_RATE]: (state, { type, payload }) => payload
  },
  null
);

export const accountInfo = handleActions(
  {
    [GET_ACCOUNT_INFO]: (state, { type, payload }) => payload
  },
  null
);

export const accountInfoPosition = handleActions(
  {
    [GET_ACCOUNT_INFO_POSITION]: (state, { type, payload }) => payload
  },
  null
);
