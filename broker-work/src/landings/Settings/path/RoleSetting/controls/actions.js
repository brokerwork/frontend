import { createAction } from 'redux-actions';
import { get, post } from 'utils/ajax';
import {
  RIGHT_ENTITY_NO_TIPS,
  RIGHT_ENTITY_REMINDER_TIPS
} from '../../../constant';

// ---------------------------------------------
// action typs
// ---------------------------------------------

const PRE_FIX = 'ROLE_SETTING_';

export const GET_ROLE_LIST = `${PRE_FIX}GET_ROLE_LIST`;
export const CREATE_ROLE = `${PRE_FIX}CREATE_ROLE`;
export const UPDATE_ROLE = `${PRE_FIX}UPDATE_ROLE`;
export const REMOVE_ROLE = `${PRE_FIX}REMOVE_ROLE`;
export const GET_ROLE_OPTION = `${PRE_FIX}GET_ROLE_OPTION`;
export const GET_ROLE_TYPE = `${PRE_FIX}GET_ROLE_TYPE`;
export const GET_ROLE_NUM_BY_TYPE = `${PRE_FIX}GET_ROLE_NUM_BY_TYPE`;
export const GET_BELONG_COUNT = `${PRE_FIX}GET_BELONG_COUNT`;
export const GET_SUB_ROLE = `${PRE_FIX}GET_SUB_ROLE`;
export const UPDATE_CURRENT_ROLE = `${PRE_FIX}UPDATE_CURRENT_ROLE`;
export const GET_RIGHT_TREE = `${PRE_FIX}GET_RIGHT_TREE`;
export const ROLE_RIGHTS_CHECK = `${PRE_FIX}ROLE_RIGHTS_CHECK`;
export const GET_ROLE_TREE_DATA = `${PRE_FIX}GET_ROLE_TREE_DATA`;
export const CHECK_PARENT_CHILD = `${PRE_FIX}CHECK_PARENT_CHILD`;

// ---------------------------------------------
// action creaters
// ---------------------------------------------

// 角色权限检查
export const roleRightsCheck = createAction(
  ROLE_RIGHTS_CHECK,
  (data, parentId) =>
    post({
      url: `/v1/roleRight/right/check?parentId=${parentId}`,
      data
    })
);

export const getRoleList = createAction(GET_ROLE_LIST, () =>
  post({
    url: '/v1/roleRight/role/listDetail'
  })
);

export const updateCurrentRole = createAction(
  UPDATE_CURRENT_ROLE,
  role => role
);

export const getRoleOption = createAction(GET_ROLE_OPTION, () =>
  post({
    url: '/v1/roleRight/role/list'
  })
);

// 获取角色类型列表
export const getRoleType = createAction(GET_ROLE_TYPE, () =>
  get({
    url: '/v1/role/type/list'
  })
);

// 获取相应角色类型的权限编号列表
export const getRoleNumByType = createAction(GET_ROLE_NUM_BY_TYPE, type =>
  get({
    url: `/v1/role/type/right/${type}`
  })
);

const sensitiveInfoMark = data => {
  data.forEach(item => {
    if (
      item.entityNo.match(/_SENSITIVE$/) ||
      item.entityNo in RIGHT_ENTITY_REMINDER_TIPS
    ) {
      item['tips'] = true;
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      item.children = sensitiveInfoMark(item.children);
    }
  });
  return data;
};

const treeNodeTips = data => {
  const keys = Object.keys(RIGHT_ENTITY_NO_TIPS);

  data.forEach(item => {
    if (keys.includes(item.entityNo)) {
      item['tips'] = true;
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      item.children = treeNodeTips(item.children);
    }
  });

  return data;
};

const parseRightTreeData = data => {
  const _data = treeNodeTips(data);

  return sensitiveInfoMark(_data);
};

export const getRightTree = createAction(GET_RIGHT_TREE, () =>
  get({
    url: '/v1/right/listTopRights'
  }).then(res => {
    if (!res.result) return Promise.resolve(res);
    // 敏感信息权限判断
    return Promise.resolve({
      ...res,
      data: parseRightTreeData(res.data)
    });
  })
);

export const getBelongCount = createAction(
  GET_BELONG_COUNT,
  (id, includeParent, type) =>
    get({
      url: `/v1/user/list/type?type=${type}&id=${id}&includeParent=${includeParent}`
    })
);

export const getSubRole = createAction(GET_SUB_ROLE, id =>
  post({
    url: `/v1/role/${id}/findRoleDetailById`
  })
);

export const updateRole = createAction(UPDATE_ROLE, (data, parentId) =>
  post({
    url: `/v1/role/${parentId}/upsert`,
    data: data
  })
);

export const removeRole = createAction(REMOVE_ROLE, id =>
  post({
    url: `/v1/role/${id}/remove`
  })
);

// 获取用户树数据
export const getRoleData = createAction(GET_ROLE_TREE_DATA, roleId =>
  get({
    url: `/v1/role/${roleId}/child/tree`
  })
);

// 获取用户树数据
export const checkParentChild = createAction(CHECK_PARENT_CHILD, roleId => {
  if (!roleId) {
    // 0 undefied null
    return null;
  } else {
    return get({
      url: `/v1/roleRight/checkParentChild/${roleId}`
    });
  }
});
