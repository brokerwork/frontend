import { connect } from 'react-redux';
import ActionBar from '../components/ActionBar';
import { submit } from 'redux-form';
import {
  showTopAlert,
  showTipsModal,
  saveFormSortColumns
} from 'commonActions/actions';
import {
  modifyParams,
  getUserLevel,
  getListData,
  selectUser,
  clearSuperiorUsers,
  getSuperiorUsers,
  saveTransferUsers,
  getServerList,
  getUpdateUserLevel,
  getUserRole,
  addUser,
  getPasswordStrength,
  getUserSubLevelUsers,
  getListColumns,
  getFormColumns,
  getAuthSetting
} from '../controls/actions';

export default connect(
  ({
    common,
    userManagement: {
      options,
      params,
      selectedUsers,
      superiorUsers,
      UserActionbarLevelList,
      commissionShowStatus,
      listColumns,
      paginationInfo,
      listUpdateTime
    }
  }) => ({
    userRights: common.userRights,
    options: options,
    params: params,
    selectedUsers,
    superiorUsers,
    levelList: UserActionbarLevelList,
    commissionShowStatus: commissionShowStatus,
    listColumns,
    paginationInfo,
    listUpdateTime
  }),
  {
    modifyParams,
    getUserLevel,
    getListData,
    selectUser,
    showTopAlert,
    showTipsModal,
    clearSuperiorUsers,
    getSuperiorUsers,
    saveTransferUsers,
    getServerList,
    getUpdateUserLevel,
    getUserRole,
    getPasswordStrength,
    addUser,
    submitForm: submit,
    getUserSubLevelUsers,
    getListColumns,
    getFormColumns,
    saveFormSortColumns,
    getAuthSetting
  }
)(ActionBar);
