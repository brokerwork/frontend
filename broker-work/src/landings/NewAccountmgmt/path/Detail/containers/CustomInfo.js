import CustomInfo from '../components/CustomInfo';
import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';
import {
  setAccountId,
  checkOwnerInfoDiff,
  getAccountDetail,
  globalFormChange,
  updateCustomInfo,
  boundCustomer
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    common: {
      userRights
    },
    accountManagement: {
      formColumns,
      currentServer,
      ownerInfoModule,
      detail: {
        accountId,
        ownerInfo,
        ownerRelatedInfo,
        taUserInfo,
        changedFormArray
      }
    }
  }) => ({
    formColumns,
    currentServer,
    ownerInfoModule,
    accountId,
    ownerInfo,
    ownerRelatedInfo,
    taUserInfo,
    changedFormArray,
    userRights
  }),
  {
    getAccountDetail,
    checkOwnerInfoDiff,
    setAccountId,
    showTipsModal,
    showTopAlert,
    submitForm: submit,
    resetForm: reset,
    globalFormChange,
    updateCustomInfo,
    boundCustomer
  }
)(CustomInfo);
