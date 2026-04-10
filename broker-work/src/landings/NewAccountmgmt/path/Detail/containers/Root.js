import Root from '../components/Root';
import { connect } from 'react-redux';
import { submit, reset } from 'redux-form';
import {
  setAccountId,
  getAccountDetail,
  getAppropriatenessTestStatus,
  globalFormChange,
  globalFormEmpty
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    accountManagement: {
      currentServer,
      rights,
      detail: { accountId, accountInfo, changedFormArray }
    }
  }) => ({
    currentServer,
    rights,
    accountId,
    accountInfo,
    changedFormArray
  }),
  {
    setAccountId,
    getAccountDetail,
    getAppropriatenessTestStatus,
    globalFormChange,
    globalFormEmpty,
    submit,
    reset,
    showTopAlert
  }
)(Root);
