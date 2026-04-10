import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';
import UpdateUserCard from '../components/UpdateUserCard';
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
  getListData
} from '../controls/actions';

export default connect(
  ({
    common: { userInfo, brandInfo, userRights, accountTypes, versionRights },
    userManagement: {
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
      params
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
      editUserInfo: edit_user_info,
      upwardForm: up_ward_form,
      upwardInitvalue: up_ward_initvalue,
      ruleDetail: rule_detail,
      reakInput: up_ward_inputarr,
      relationUserInfo: relation_user_info,
      userRights,
      basicFormColumns,
      params,
      accountTypes,
      versionRights
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
    submitForm: submit,
    getListData,
    bindCtid,
    resetForm: reset
  }
)(UpdateUserCard);
