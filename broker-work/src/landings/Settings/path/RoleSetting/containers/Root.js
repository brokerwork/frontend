import { connect } from 'react-redux';

import {
  getRoleList,
  updateRole,
  removeRole,
  getBelongCount,
  getSubRole,
  updateCurrentRole,
  getRoleOption,
  getRightTree,
  roleRightsCheck,
  getRoleData,
  checkParentChild,
  getRoleType,
  getRoleNumByType
} from '../controls/actions';

import {
  updateCurrentUserRight,
  showTopAlert,
  showTipsModal
} from 'commonActions/actions';

import Root from '../components/Root';

export default connect(
  ({ settings: { role } }) => {
    return {
      roleList: role.role_list,
      belongList: role.belong_user,
      subRole: role.sub_role,
      roleOption: role.role_option,
      roleTypes: role.role_type,
      currentRole: role.current_Role,
      rightTree: role.right_tree,
      roleTree: role.roleTree,
      parentRights: role.parentRights
    };
  },
  {
    showTopAlert,
    showTipsModal,
    getRoleList,
    getBelongCount,
    removeRole,
    getSubRole,
    getRoleOption,
    getRoleType,
    getRoleNumByType,
    updateCurrentRole,
    getRightTree,
    updateRole,
    updateCurrentUserRight,
    roleRightsCheck,
    getRoleData,
    checkParentChild
  }
)(Root);
