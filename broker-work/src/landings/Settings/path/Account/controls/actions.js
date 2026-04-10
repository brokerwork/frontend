import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

const PRE_FIX = 'ACCOUNT_GROUP_SETTING_';

export const GET_ACCOUNT_GROUP_LIST = `${PRE_FIX}GET_ACCOUNT_GROUP_LIST`;
export const ADD_ACCOUNT_GROUP = `${PRE_FIX}ADD_ACCOUNT_GROUP`;
export const EDIT_ACCOUNT_GROUP = `${PRE_FIX}EDIT_ACCOUNT_GROUP`;
export const DELETE_ACCOUNT_GROUP = `${PRE_FIX}DELETE_ACCOUNT_GROUP`;
export const UPDATE_CURRENT_GROUP = `${PRE_FIX}UPDATE_CURRENT_GROUP`;
export const CHECK_ACCOUNT_GROUP = `${PRE_FIX}CHECK_ACCOUNT_GROUP`;
export const GET_ACCOUNT_GROUP_CONFIG = `${PRE_FIX}GET_ACCOUNT_GROUP_CONFIG`;
export const UPDATE_ACCOUNT_GROUP_CONFIG = `${PRE_FIX}UPDATE_ACCOUNT_GROUP_CONFIG`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getAccountGroupList = createAction(GET_ACCOUNT_GROUP_LIST, () =>
  get({
    url: '/v1/account/manage/userGroup/info'
  })
);

export const getAccountGroupConfig = createAction(
  GET_ACCOUNT_GROUP_CONFIG,
  () =>
    post({
      url: '/v1/ops/tenants/classify/config/find'
    }).then(res => {
      if (!res.result) {
        return res;
      }
      const data = [];
      res.data && data.push(res.data);
      return { result: true, data };
    })
);

export const updateAccountGroupConfig = createAction(
  UPDATE_ACCOUNT_GROUP_CONFIG,
  data =>
    post({
      url: '/v1/ops/tenants/classify/config/update',
      data
    })
);

export const addAccountGroup = createAction(
  ADD_ACCOUNT_GROUP,
  ({ groupName = '' }) =>
    post({
      url: '/v1/account/manage/userGroup/save',
      data: {
        groupName
      }
    })
);

export const editAccountGroup = createAction(
  EDIT_ACCOUNT_GROUP,
  ({ id = '', groupName = '' }) =>
    post({
      url: '/v1/account/manage/userGroup/save',
      data: {
        id,
        groupName
      }
    })
);

export const deleteAccountGroup = createAction(DELETE_ACCOUNT_GROUP, id =>
  post({
    url: `/v1/account/manage/userGroup/delete/${id}`
  })
);

export const updateCurrentGroup = createAction(
  UPDATE_CURRENT_GROUP,
  group => group
);

//确定是否有关联账户
export const checkAccountGroup = createAction(CHECK_ACCOUNT_GROUP, id =>
  post({
    url: `/v1/account/manage/userGroup/delete/check/${id}`
  })
);
