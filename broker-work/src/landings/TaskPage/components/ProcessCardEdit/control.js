/**
 * 自定义流程编辑
 * @file ProcessCardEdit/control.js
 * @author david
 */

import { createAction, handleActions } from 'redux-actions';
import { get, post, all } from 'utils/ajax';
import _ from 'lodash';

const TASK_PROCESS_PERMISSIONS = 'TASK_PROCESS_PERMISSIONS_';
const GET_PERMISSIONS = `${TASK_PROCESS_PERMISSIONS}GET_PERMISSIONS`;
const GET_EDIT_DATA = `${TASK_PROCESS_PERMISSIONS}GET_EDIT_DATA`;
const RESET = `${TASK_PROCESS_PERMISSIONS}RESET`;
const UPDATE_DATA = `${TASK_PROCESS_PERMISSIONS}UPDATE_DATA`;

// action集合, 方便外部引用
export const actions = {};
// reducer集合, 方便外部引用
export const reducers = {};

// 获取mt组数据
const getPermissions = createAction(GET_PERMISSIONS, () =>
  get({
    url: `/v1/report/setting/serverGroups`
  }).then(res => {
    const { result, data } = res;
    // 转化groups为可选项. 方便Picklist使用
    if (!result) return res;
    let d = data.concat();
    if (Array.isArray(data)) {
      d = data.map(item => {
        const { groups = [] } = item;
        item.options = groups.map(d => {
          return { value: d, label: d };
        });
        return item;
      });
    }
    return { ...res, data: d };
  })
);
actions['getPermissions'] = getPermissions;

// mt组数据
const permissions = handleActions(
  {
    [GET_PERMISSIONS]: (_, { payload }) => payload,
    [RESET]: () => []
  },
  []
);
reducers['permissions'] = permissions;

// mt组数据 服务器ID与数据的映射, 方便取值
const permissionMaps = handleActions(
  {
    [GET_PERMISSIONS]: (_, { payload }) => {
      const obj = {};
      payload.forEach(i => {
        obj[i.serverId] = i;
      });
      return obj;
    },
    [RESET]: () => ({})
  },
  {}
);
reducers['permissionMaps'] = permissionMaps;

// 获取编辑数据
const getEditData = createAction(GET_EDIT_DATA, (item, index, permissions) => {
  if (item) {
    const { participant = [] } = item;
    // 映射 mt组, 用于控制对应组的启用状态
    participant.forEach(i => {
      // 已经添加了mtGroupsMap的情况下, 不再做处理
      if (i.mtGroupsMap) return;
      const mtGroupsMap = {};
      const { mtGroups = [] } = i;
      permissions.forEach(ii => {
        const obj = _.cloneDeep(ii);
        obj['groups'] = [];
        obj['disable'] = true;
        mtGroupsMap[ii.serverId] = obj;
      });
      mtGroups.forEach(group => {
        mtGroupsMap[group.serverId] = group;
        if (!_.isEmpty(group.groups)) {
          mtGroupsMap[group.serverId]['disable'] = false;
        }
      });
      i['mtGroupsMap'] = mtGroupsMap;
    });
    return item;
  } else {
    return {};
  }
});
actions['getEditData'] = getEditData;

const editData = handleActions(
  {
    [GET_EDIT_DATA]: (_, { payload }) => payload,
    [UPDATE_DATA]: (_, { payload }) => payload,
    [RESET]: () => ({})
  },
  {}
);
reducers['editData'] = editData;

// 重置数据
const reset = createAction(RESET);
actions['reset'] = reset;

// 升级数据
const updateData = createAction(UPDATE_DATA, data => data);
actions['updateData'] = updateData;
