import { connect } from 'react-redux';
import { submit } from 'redux-form';
import UpdateUserCard from '../components/Root';
import { showTopAlert, showTipsModal, bindCtid } from 'commonActions/actions';

import {
  getUserLevel,
  getUserRole,
  getServerList,
  getParents,
  getUpwardReturn,
  getRuleDetail,
  getUserInfo,
  clearUserInfo,
  getFormColumns,
  modifyParams,
  getUpdateUserLevel,
  getPasswordStrength,
  getAccountDropdownData,
  getLevelByUserId,
  changeBwUserOwner,
  bindBwUser,
  addUser,
  getListData,
  checkSameLogin
} from '../controls/actions';

export default connect(
  ({
    common,
    customMgmt: {
      userAddBind: {
        server_list,
        role_list,
        level_list,
        parents_list,
        password_strength,
        edit_user_info,
        up_ward_form,
        up_ward_initvalue,
        rule_detail,
        relation_user_info,
        up_ward_inputarr,
        basicFormColumns,
        moreFormColumns,
        accountDropdownData,
        accountFormColumns,
        params
      }
    }
  }) => {
    return {
      serverList: server_list,
      userInfo: common.userInfo,
      roleList: role_list,
      brandInfo: common.brandInfo,
      levelList: level_list,
      parentsList: parents_list,
      passwordStrength: password_strength,
      editUserInfo: edit_user_info,
      upwardForm: up_ward_form,
      upwardInitvalue: up_ward_initvalue,
      ruleDetail: rule_detail,
      reakInput: up_ward_inputarr,
      relationUserInfo: relation_user_info,
      userRights: common.userRights,
      basicFormColumns,
      moreFormColumns,
      accountDropdownData,
      accountFormColumns,
      params
    };
  },
  {
    showTipsModal,
    showTopAlert,
    getUserLevel,
    getServerList,
    getUserRole,
    getParents,
    getUserInfo,
    getUpwardReturn,
    getRuleDetail,
    clearUserInfo,
    getFormColumns,
    modifyParams,
    getUpdateUserLevel,
    getPasswordStrength,
    getAccountDropdownData,
    getLevelByUserId,
    bindBwUser,
    addUser,
    changeBwUserOwner,
    submitForm: submit,
    getListData,
    checkSameLogin,
    bindCtid
  }
)(UpdateUserCard);
