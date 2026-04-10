import { handleActions } from 'redux-actions';
import {
  GET_NOTIFY_SETTING,
  SAVE_NOTIFY_SETTING,
  GET_RECEIVER_LIST,
  GET_ROLE_OPTION,
  GET_SYSTEM_SETTINGS,
  GET_VAS_SWITCH,
  ADD_RULE,
  EDIT_RULE,
  DELETE_RULE,
  UPDATE_NOTIFY_WAY,
  SWITCH_MAIIN,
  GET_GROUP
} from './actions';

export const timeReportSet = handleActions(
  {
    [GET_NOTIFY_SETTING]: (state, { type, payload }) => payload
  },
  {
    open: false,
    timeZone: 8,
    userIds: [],
    emails: []
  }
);

export const receiverList = handleActions(
  {
    [GET_RECEIVER_LIST]: (state, { type, payload }) => payload
  },
  []
);

const parseRoleListData = roleList => {
  const copyData = roleList.concat();

  return copyData.map(role => {
    return {
      label: role.name,
      value: role.id
    };
  });
};

export const roleOptions = handleActions(
  {
    [GET_ROLE_OPTION]: (state, { type, payload }) => parseRoleListData(payload)
  },
  []
);

export const systemSettings = handleActions(
  {
    [GET_SYSTEM_SETTINGS]: (state, { type, payload }) => payload,
    [SWITCH_MAIIN]: (state, { type, payload }) => payload,
    [UPDATE_NOTIFY_WAY]: (state, { type, payload }) => payload,
    [ADD_RULE]: (state, { type, payload }) => payload,
    [EDIT_RULE]: (state, { type, payload }) => payload,
    [DELETE_RULE]: (state, { type, payload }) => payload
  },
  {}
);

export const vasSwitch = handleActions(
  {
    [GET_VAS_SWITCH]: (state, { type, payload }) => payload
  },
  {}
);
export const serverGroup = handleActions(
  {
    [GET_GROUP]: (state, { type, payload }) => payload
  },
  []
);

