import { handleActions } from 'redux-actions';
import {
  GET_ROLE_LIST,
  GET_ROLE_OPTION,
  GET_ROLE_TYPE,
  GET_BELONG_COUNT,
  GET_SUB_ROLE,
  UPDATE_CURRENT_ROLE,
  GET_RIGHT_TREE,
  GET_ROLE_TREE_DATA,
  CHECK_PARENT_CHILD
} from './actions';

export const role_list = handleActions(
  {
    [GET_ROLE_LIST]: (state, { type, payload }) => payload
  },
  []
);

export const role_option = handleActions(
  {
    [GET_ROLE_OPTION]: (state, { type, payload }) => payload
  },
  []
);

export const belong_user = handleActions(
  {
    [GET_BELONG_COUNT]: (state, { type, payload }) => payload
  },
  []
);

export const sub_role = handleActions(
  {
    [GET_SUB_ROLE]: (state, { type, payload }) => payload
  },
  []
);

export const current_Role = handleActions(
  {
    [UPDATE_CURRENT_ROLE]: (state, { type, payload }) => payload
  },
  []
);

export const role_type = handleActions(
  {
    [GET_ROLE_TYPE]: (state, { payload }) => payload
  },
  []
);

export const right_tree = handleActions(
  {
    [GET_RIGHT_TREE]: (state, { type, payload }) => payload
  },
  []
);

export const roleTree = handleActions(
  {
    [GET_ROLE_TREE_DATA]: (state, { type, payload }) => payload
  },
  []
);

export const parentRights = handleActions(
  {
    [CHECK_PARENT_CHILD]: (state, { type, payload }) => {
      if (!payload) return null;
      return payload.parentRightIdList || [];
    }
  },
  []
);
