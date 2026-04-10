import { connect } from 'react-redux';
import { submit, change } from 'redux-form';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import {
  getMTGroupList,
  clearMTGroupList,
  createLink,
  getUserGroupList,
  getLeverageList,
  clearUserGroupList,
  clearLeverageList,
  updateLink
} from '../controls/actions';
import CreateLinkModal from '../components/CreateLinkModal';

export default connect(
  ({ settings: { link }, common }) => {
    return {
      typeList: link.typeList,
      serverList: link.serverList,
      mtGroupList: link.mtGroupList,
      brandInfo: common.brandInfo,
      leverageList: link.leverageList,
      userGroupList: link.userGroupList
    };
  },
  {
    showTopAlert,
    getMTGroupList,
    clearMTGroupList,
    createLink,
    submitForm: submit,
    changeFormField: change,
    getUserGroupList,
    getLeverageList,
    clearUserGroupList,
    clearLeverageList,
    showTipsModal,
    updateLink
  }
)(CreateLinkModal);
