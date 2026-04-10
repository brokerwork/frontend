import { handleActions } from 'redux-actions';
import {
  GET_ROLE_LIST,
  GET_USER_LIST,
  GET_SERVER_LIST,
  GET_USER_AGENT_FORM_COLUMNS,
  GET_PASSWORD_STRENGTH
} from './actions';
import { GENDER_TYPE } from '../constant';

export const roleList = handleActions(
  {
    [GET_ROLE_LIST]: (state, { type, payload }) => {
      return payload.concat().map(item => {
        return {
          label: item.name,
          value: item.id
        };
      });
    }
  },
  []
);

export const userList = handleActions(
  {
    [GET_USER_LIST]: (state, { type, payload }) => {
      return payload.concat().map(item => {
        return {
          label: `${item.entityNo}：${item.name}`,
          value: item.id
        };
      });
    }
  },
  []
);

//组合所属服务器信息
const parseServerListData = serverList => {
  const copyData = serverList.concat();

  return copyData.map(server => {
    return {
      label: server.desc,
      value: `${server.vendor}_${server.serverId}`
    };
  });
};

//获取服务器列表
export const serverList = handleActions(
  {
    [GET_SERVER_LIST]: (state, { type, payload }) =>
      parseServerListData(payload)
  },
  []
);

export const genderList = handleActions({}, GENDER_TYPE);

export const userAgentColumns = handleActions(
  {
    [GET_USER_AGENT_FORM_COLUMNS]: (state, { type, payload }) => payload
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
