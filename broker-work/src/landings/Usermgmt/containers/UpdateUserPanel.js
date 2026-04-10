import { connect } from 'react-redux';
import { submit } from 'redux-form';
import UpdateUserPanel from '../components/UpdateUserCard/MainPanel';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

import {
  getUserLevel,
  getUserRole,
  getServerList,
  getParents,
  getUpwardReturn,
  getRuleDetail,
  getUserInfo,
  getFormColumns,
  getUpdateUserLevel,
  getPasswordStrength,
  getUserSubLevelUsers,
  getAccountDropdownData,
  getCtraderCurrencyByServerId,
  clearUserInfo,
  getLevelByUserId,
  checkSameLogin,
  validateUserIdNum,
  getDefaultParams,
  editUser
} from '../controls/actions';

export default connect(
  ({
    common: { userInfo, userRights, brandInfo, accountTypes, versionRights },
    userManagement: {
      server_list,
      role_list,
      level_list,
      parents_list,
      password_strength,
      up_ward_form,
      up_ward_initvalue,
      rule_detail,
      relation_user_info,
      up_ward_inputarr,
      basicFormColumns,
      moreFormColumns,
      accountFormColumns,
      accountDropdownData,
      initLevelInfo,
      defaultParams
    }
  }) => {
    return {
      serverList: server_list,
      userInfo,
      roleList: role_list,
      brandInfo,
      levelList: level_list,
      parentsList: parents_list,
      passwordStrength: password_strength,
      upwardForm: up_ward_form,
      upwardInitvalue: up_ward_initvalue,
      ruleDetail: rule_detail,
      reakInput: up_ward_inputarr,
      relationUserInfo: relation_user_info,
      userRights,
      basicFormColumns,
      moreFormColumns,
      accountFormColumns,
      accountDropdownData,
      initLevelInfo,
      defaultParams,
      accountTypes,
      versionRights
    };
  },
  {
    showTipsModal,
    showTopAlert,
    getUserLevel,
    getUserRole,
    getServerList,
    getParents,
    getUpwardReturn,
    getRuleDetail,
    getUserInfo,
    getFormColumns,
    getUpdateUserLevel,
    getPasswordStrength,
    getUserSubLevelUsers,
    submitForm: submit,
    getAccountDropdownData,
    getCtraderCurrencyByServerId,
    clearUserInfo,
    getLevelByUserId,
    checkSameLogin,
    validateIdNum: validateUserIdNum,
    getDefaultParams,
    editUser
  }
)(UpdateUserPanel);
