import { connect } from 'react-redux';
import AccountForm from '../components/AccountForm';
import {
  getAccountProfile,
  changeField,
  changeFieldData,
  saveAccountProfile,
  setError,
  clearError
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'common/actions';

export default connect(
  ({ accountSetting: { accountProfile, errorMap } }) => ({
    config: accountProfile,
    errorMap
  }),
  {
    getAccountProfile,
    showTipsModal,
    showTopAlert,
    changeField,
    changeFieldData,
    saveAccountProfile,
    setError,
    clearError
  }
)(AccountForm);
