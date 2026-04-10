import { connect } from 'react-redux';
import ResetPassword from '../components/ResetPassword';

import {
  submit,
  modifyParams,
  getPasswordReg,
  showError
} from '../controls/actions';

import {
  getLanguage,
  showTopAlert,
  closeTopAlert,
  setLanguageType
} from 'commonActions/actions';

export default connect(
  ({ resetPassword, common }) => ({
    errorMessage: resetPassword.errorMessage,
    resetPasswordParams: resetPassword.resetPasswordParams,
    passwordReg: resetPassword.passwordReg,
    brandInfo: common.brandInfo
  }),
  {
    submit,
    modifyParams,
    getPasswordReg,
    getLanguage,
    showTopAlert,
    closeTopAlert,
    showError,
    setLanguageType
  }
)(ResetPassword);
