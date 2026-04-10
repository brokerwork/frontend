import { connect } from 'react-redux';
import List from '../components/List';
import { submit } from 'redux-form';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import {
  modifyParams,
  getListData,
  modifyLoginStatus,
  selectUser,
  getAllUser,
  getUserInfo,
  getParents,
  getUpwardReturn,
  editUser,
  removeUsers,
  getUserSubLevelUsers,
  saveFormSortColumns,
  getListColumns,
  clearSuperiorUsers,
  getSuperiorUsers,
  saveTransferUsers,
  updateUser,
  getAuthSetting,
  modifyAuthStatus,
  updateFieldConditions
} from '../controls/actions';

export default connect(
  ({
    common,
    userManagement: {
      options,
      params,
      listData,
      paginationInfo,
      selectedUsers,
      optionsObject,
      edit_user_info,
      commissionShowStatus,
      listColumns,
      showlistColumns,
      typesOptions,
      superiorUsers,
      authSetting
    }
  }) => ({
    versionRights: common.versionRights,
    userRights: common.userRights,
    params: params,
    data: listData,
    paginationInfo,
    selectedUsers,
    optionsObject,
    editUserInfo: edit_user_info,
    commissionShowStatus: commissionShowStatus,
    listColumns,
    showlistColumns,
    typesOptions: typesOptions,
    superiorUsers,
    authSetting
  }),
  {
    modifyParams,
    getListData,
    modifyLoginStatus,
    selectUser,
    showTopAlert,
    getAllUser,
    getUserInfo,
    getParents,
    getUpwardReturn,
    submitForm: submit,
    editUser,
    getUserSubLevelUsers,
    showTipsModal,
    saveFormSortColumns,
    getListColumns,
    removeUsers,
    clearSuperiorUsers,
    getSuperiorUsers,
    saveTransferUsers,
    updateUser,
    getAuthSetting,
    modifyAuthStatus,
    updateFieldConditions
  }
)(List);
