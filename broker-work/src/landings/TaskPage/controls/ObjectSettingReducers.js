import { handleActions } from 'redux-actions';
import i18n from 'utils/i18n';
import {
  GET_OBJECT_SETTING_DETAILS,
  MODIFY_CATEGORYS_DATA,
  GET_STEP_DATA,
  INITIAL_TASK_GROUP_MEMBER,
  INITIAL_SERVER_LIST,
  MODIFY_OBJECT_NAME,
  MODIFY_SEND_SMS,
  INITIAL_LEVERAGE_LIST,
  GET_CTRADERR_FORM,
  GET_CTRADER_USER_GROUP,
  GET_CTRADER_CURRENCY_BY_SERVER_ID,
  GET_ACCOUNT_FIELDS
} from './ObjectSettingActions';
import { UPDATE_TASK_OBJECT } from './actions';

export const details = handleActions(
  {
    [MODIFY_OBJECT_NAME]: (state, { payload }) => {
      return {
        ...state,
        itemName: payload
      };
    },
    [MODIFY_SEND_SMS]: (state, { payload }) => {
      return {
        ...state,
        sendSMS: payload
      };
    },
    [MODIFY_CATEGORYS_DATA]: (state, { payload }) => {
      const { value, index, type } = payload;
      const __arr = state.categorys.concat();
      const stateObj = { ...state };
      __arr[index][type] = value;
      if (
        __arr[index]['jobType'] === 'JOB_TYPE_TA_UPDATE_OWNER' &&
        __arr[index]['verify'] !== ''
      ) {
        //特殊处理
        __arr[index]['verifyFields'] = [];
      }
      if (type === 'serverId') {
        __arr[index]['groupId'] = '';
      }
      if (type === 'serverId5') {
        __arr[index]['groupId5'] = '';
      }
      if (type === 'cbrokerServerId') {
        __arr[index]['cbrokerGroupId'] = '';
      }
      stateObj['categorys'] = __arr;
      return stateObj;
    },
    [GET_OBJECT_SETTING_DETAILS]: (state, { payload }) => {
      payload.categorys = payload.categorys.map(item => {
        item.verify = item.threshold ? '' : item.verify;
        if (item.jobType === 'JOB_TYPE_TA_UPDATE_OWNER') {
          //特殊处理
          const { verify, verifyFields = [] } = item;
          if (verify === false && verifyFields.length) {
            item.verify = '';
          }
        }
        if (!item.reminder) return item;
        item.reminder = item.reminder.map(v => {
          return {
            ...v,
            label: v.name,
            value: v.userId
          };
        });
        return item;
      });
      return payload;
    },
    [UPDATE_TASK_OBJECT]: () => ({
      categorys: [],
      itemId: '',
      itemName: ''
    })
  },
  {
    categorys: [],
    itemId: '',
    itemName: ''
  }
);

export const stepData = handleActions(
  {
    [GET_STEP_DATA]: (state, { payload }) => payload,
    [UPDATE_TASK_OBJECT]: () => []
  },
  []
);

export const taskGroupMembers = handleActions(
  {
    [INITIAL_TASK_GROUP_MEMBER]: (state, { payload }) => payload,
    [UPDATE_TASK_OBJECT]: () => []
  },
  []
);

const serverListFormat = (arr, vender) => {
  return arr.map(item => {
    const __obj = {
      value: item.serverId,
      label: item.serverName,
      vender: vender
    };
    if (item.groups) {
      __obj.groups = item.groups.map(v => {
        return {
          value: v,
          label: v
        };
      });
    }
    return __obj;
  });
};

export const serverList = handleActions(
  {
    [INITIAL_SERVER_LIST]: (state, { payload }) => {
      let { mt4, mt5, ct } = payload;
      mt4 = serverListFormat(mt4, 'MT4');
      mt5 = serverListFormat(mt5, 'MT5');
      ct = serverListFormat(ct, 'CTRADER');
      return { mt4, mt5, ct };
    }
  },
  {
    mt4: [],
    mt5: [],
    ct: []
  }
);

export const leverageList = handleActions(
  {
    [INITIAL_LEVERAGE_LIST]: (state, { payload }) => payload
  },
  {
    mt4: [],
    mt5: [],
    ct: []
  }
);
const fields = {
  ctraderAccountType: true,
  frenchRisk: true,
  totalMarginCalculationType: true,
  accessRight: true,
  currency: true,
  leverage: true,
  maxLeverage: true,
  group: true
};
const serverIdField = {
  label: i18n['task.create_account.account_info.server_owner'],
  fieldType: 'select',
  key: 'serverId',
  validateType: { required: true },
  columns: 1
};
export const cTraderFormFields = handleActions(
  {
    [GET_CTRADERR_FORM]: (state, { payload }) =>
      [serverIdField].concat(payload.filter(item => fields[item.key]))
  },
  []
);

// 账户信息下拉信息
export const cTraderExtenalData = handleActions(
  {
    [GET_CTRADER_USER_GROUP]: (state, { payload }) => {
      const __userGroupsData = payload.map(item => {
        return {
          label: item.groupName || '',
          value: item.id
        };
      });
      return {
        ...state,
        userGroupsData: __userGroupsData
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
    userGroupsData: [],
    currencyData: {}
  }
);

export const accountFields = handleActions(
  {
    [GET_ACCOUNT_FIELDS]: (state, { payload }) => payload
  },
  []
);
