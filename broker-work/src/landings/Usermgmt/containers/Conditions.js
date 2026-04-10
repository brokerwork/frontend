import { connect } from 'react-redux';
import Conditions from '../components/Conditions';
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
  removeUsers,
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
  updateCondition,
  updateFieldConditions
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
      typesOptions,
      listColumns,
      advancedSearchType,
      advancedSearchConditions,
      searchFieldConditions
    }
  }) => {
    return {
      userRights: common.userRights,
      options: options,
      params: params,
      selectedUsers,
      superiorUsers,
      levelList: UserActionbarLevelList,
      commissionShowStatus: commissionShowStatus,
      typesOptions: typesOptions,
      listColumns,
      advancedSearchType,
      advancedSearchConditions,
      searchFieldConditions
    };
  },
  {
    modifyParams,
    getUserLevel,
    getListData,
    selectUser,
    showTopAlert,
    showTipsModal,
    removeUsers,
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
    updateCondition,
    updateFieldConditions
  }
)(Conditions);
