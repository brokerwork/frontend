import OwnerInfo from '../components/OwnerInfo';
import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';
import {
  setAccountId,
  checkOwnerInfoDiff,
  boundCustomer,
  getAccountDetail,
  updateOwnerInfo,
  exportClassificationInfo,
  verifyIdentity,
  globalFormChange,
  globalFormFailed
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    accountManagement: {
      formColumns,
      currentServer,
      ownerInfoModule,
      detail: {
        accountId,
        ownerInfo,
        ownerRelatedInfo,
        diffOwnerInfo,
        taUserInfo,
        appropriatenessTestStatus,
        changedFormArray,
        failedFormArray
      }
    }
  }) => ({
    formColumns,
    currentServer,
    ownerInfoModule,
    accountId,
    ownerInfo,
    ownerRelatedInfo,
    diffOwnerInfo,
    taUserInfo,
    appropriatenessTestStatus,
    changedFormArray,
    failedFormArray
  }),
  {
    setAccountId,
    checkOwnerInfoDiff,
    showTipsModal,
    boundCustomer,
    showTopAlert,
    getAccountDetail,
    submitForm: submit,
    resetForm: reset,
    updateOwnerInfo,
    exportClassificationInfo,
    verifyIdentity,
    globalFormChange,
    globalFormFailed
  }
)(OwnerInfo);
