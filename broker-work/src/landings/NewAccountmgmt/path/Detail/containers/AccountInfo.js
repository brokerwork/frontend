import AccountInfo from '../components/AccountInfo';
import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';
import {
  setAccountId,
  updateAccountInfo,
  globalFormChange
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    common: { versionRights, accountTypes },
    accountManagement: {
      currentServer,
      formColumns,
      detail: { accountInfo, changedFormArray }
    }
  }) => ({
    currentServer,
    formColumns,
    accountInfo,
    changedFormArray,
    versionRights,
    accountTypes
  }),
  {
    setAccountId,
    submitForm: submit,
    resetForm: reset,
    updateAccountInfo,
    showTopAlert,
    globalFormChange
  }
)(AccountInfo);
