import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'LEVEL_SETTING_';

export const GET_LEVEL_LIST = `${PRE_FIX}GET_LEVEL_LIST`;
export const ADD_LEVEL = `${PRE_FIX}ADD_LEVEL`;
export const EDIT_LEVEL = `${PRE_FIX}EDIT_LEVEL`;
export const DELETE_LEVEL = `${PRE_FIX}DELETE_LEVEL`;
export const GET_USER_COUNT_DETAIL = `${PRE_FIX}GET_USER_COUNT_DETAIL`;
export const UPDATE_CURRENT_LEVEL = `${PRE_FIX}UPDATE_CURRENT_LEVEL`;
export const GET_DEFAULT_LEVEL = `${PRE_FIX}GET_DEFAULT_LEVEL`;
export const UPDATE_DEFAULT_LEVEL = `${PRE_FIX}UPDATE_DEFAULT_LEVEL`;
export const GET_DEFAULT_LEVEL_LIST = `${PRE_FIX}GET_DEFAULT_LEVEL_LIST`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

export const getLevelList = createAction(GET_LEVEL_LIST, () =>
  get({
    url: '/v1/level/list'
  })
);

export const addLevel = createAction(
  ADD_LEVEL,
  ({ name = '', sid = '', userCount = 0 }) =>
    post({
      url: '/v1/level/add',
      data: {
        name,
        sid,
        userCount
      }
    })
);

export const editLevel = createAction(
  EDIT_LEVEL,
  ({ name = '', sid = '', userCount = 0, id = '' }) =>
    post({
      url: '/v1/level/update',
      data: {
        name,
        sid,
        userCount,
        id
      }
    })
);

export const deleteLevel = createAction(DELETE_LEVEL, levelId =>
  post({
    url: `/v1/level/${levelId}/remove`
  })
);

export const getUserCountDetail = createAction(
  GET_USER_COUNT_DETAIL,
  ({ type = 1, includeParent = false, id = '' }) =>
    get({
      url: '/v1/user/list/type',
      data: {
        type,
        includeParent,
        id
      }
    })
);

export const updateCurrentLevel = createAction(
  UPDATE_CURRENT_LEVEL,
  level => level
);
// 获取默认返佣层级数值，用于回显
export const getDefaultLevel = createAction(GET_DEFAULT_LEVEL, levelId =>
  get({
    url: `/v1/report/setting/level/default/params/${levelId}`
  })
);
// 修改默认返佣层级
export const updateDefaultLevel = createAction(
  UPDATE_DEFAULT_LEVEL,
  (levelId, data) =>
    post({
      url: `/v1/report/setting/level/default/params/${levelId}`,
      data
    })
);
// 获取默认返佣层级列表
export const getDefaultLevelList = createAction(
  GET_DEFAULT_LEVEL_LIST,
  (levelId, data) =>
    get({
      url: `/v1/report/setting/avaiable/rule/${levelId}`,
      data
    })
);
