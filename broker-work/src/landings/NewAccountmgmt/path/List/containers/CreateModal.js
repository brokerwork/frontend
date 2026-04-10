import CreateModal from '../components/CreateModal';
import { connect } from 'react-redux';
import { createAccount, getOwnerInfo } from '../controls/actions';
import { showTopAlert, showTipsModal, bindCtid } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(
  ({
    common: { accountTypes, versionRights },
    accountManagement: {
      currentServer,
      passwordRegular,
      formColumns,
      accountRange
    }
  }) => ({
    currentServer,
    passwordRegular,
    formColumns,
    accountRange,
    accountTypes,
    versionRights
  }),
  {
    createAccount,
    getOwnerInfo,
    showTopAlert,
    showTipsModal,
    submitForm: submit,
    bindCtid
  }
)(CreateModal);
