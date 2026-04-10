import { handleActions } from 'redux-actions';

// ---------------------------------------------
// action typs
// ---------------------------------------------

import {
  SAVE,
  MODIFY_MESSAGE_PARAMS,
  GET_TEMPLATES,
  GET_AVALIABLE_EMAILS,
  MODIFY_TEMPLATE,
  MODIFY_MESSAGE_TYPE,
  MODIFY_SEND_OBJECT_OPTIONS,
  RESET_FORM,
  WARNING_CHECK
} from './actions';

import { GET_USER_INFO, GET_CURRENT_USER_RIGHT } from 'commonActions/actions';

import { MESSAGE_TYPES } from '../../../constant';

// ---------------------------------------------
// reducers
// ---------------------------------------------

export const checkResponse = handleActions(
  {
    [WARNING_CHECK]: (state, { payload }) => payload,
    [MODIFY_MESSAGE_TYPE]: (state, { payload }) => ({})
  },
  {}
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

// export const fromNameOptions = handleActions(
//   {
//     [GET_USER_INFO]: (state, { payload }) => {
//       const s = [...state];
//       s[0] = { label: payload.name, value: payload.name };
//       return s;
//     },
//     [MODIFY_MESSAGE_PARAMS]: (state, { payload }) => {
//       const s = [...state];
//       const { fromName } = payload;
//       if (s[0] && s[0].label === fromName) {
//         return s;
//       } else if (fromName && (!s[1] || s[1].label !== fromName)) {
//         s[1] = { label: fromName, value: fromName };
//       }
//       return s;
//     },
//     [MODIFY_TEMPLATE]: (state, { payload }) => {
//       let s = [...state];
//       if (
//         s[0]['label'] !== payload.name &&
//         payload.name &&
//         payload.value !== undefined
//       ) {
//         s[1] = { label: payload.name, value: payload.name };
//       } else {
//         s = [s[0]];
//       }
//       return s;
//     },
//     [MODIFY_MESSAGE_TYPE]: (state, { payload }) => {
//       return [state[0]];
//     }
//   },
//   []
// );

export const avaliableEmails = handleActions(
  {
    [GET_AVALIABLE_EMAILS]: (state, { payload }) => payload
  },
  []
);

export const templates = handleActions(
  {
    [GET_TEMPLATES]: (state, { payload }) => payload
  },
  []
);

export const messageParams = handleActions(
  {
    [MODIFY_MESSAGE_PARAMS]: (state, { payload }) => payload,
    [SAVE]: (state, { payload }) => {
      return {
        ...state,
        id: payload ? payload : state.id
      };
    },
    [MODIFY_TEMPLATE]: (state, { payload }) => {
      return {
        ...state,
        title: payload.title,
        content: payload.content,
        fromName: payload.name,
        templateId: payload.templateId,
        configId: payload.configId ? payload.configId : state.configId
      };
    },
    [MODIFY_MESSAGE_TYPE]: (state, { payload }) => {
      return {
        ...state,
        type: payload.type,
        fromName: payload.fromName,
        toName: [],
        toUserId: [],
        toRoleId: [],
        toRoleName: [],
        templateId: 0,
        title: '',
        toAll: false,
        content: '',
        configId: undefined
      };
    },
    [MODIFY_SEND_OBJECT_OPTIONS]: (state, { payload }) => {
      const toUserType = payload.length ? payload[0]['value'] : '';
      return {
        ...state,
        toUserType
      };
    },
    [GET_CURRENT_USER_RIGHT]: (state, { payload }) => {
      const types = MESSAGE_TYPES.filter(item => {
        if (item.value === 'ALL') return false;
        return payload[item.right];
      });
      if (types.length > 0) {
        let type;

        const mailType = types.find(item => item.value === 'MAIL');
        //如果有邮件通知的权限，默认邮件通知
        if (!!mailType) {
          type = mailType['value'];
        } else {
          type = types[0]['value'];
        }
        return {
          ...state,
          type
        };
      }
      return state;
    },
    [RESET_FORM]: (state, { payload }) => {
      return {
        ...state,
        toName: [],
        toUserId: [],
        toRoleId: [],
        toRoleName: [],
        configId: undefined,
        id: undefined,
        fromName: payload,
        templateId: 0,
        title: '',
        clockTime: undefined,
        toAll: false,
        toProductId: 'BW',
        toUserType: '',
        content: ''
      };
    }
  },
  {
    toName: [],
    toUserId: [],
    toRoleId: [],
    toRoleName: [],
    clockTime: undefined,
    configId: undefined,
    fromName: '',
    id: undefined,
    templateId: 0,
    title: '',
    toAll: false,
    toProductId: 'BW',
    toUserType: '',
    type: '',
    content: ''
  }
);

export const sendObjectOptions = handleActions(
  {
    [MODIFY_SEND_OBJECT_OPTIONS]: (state, { payload }) => {
      return payload;
    }
  },
  []
);
