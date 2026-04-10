import { connect } from 'react-redux';
import ForgotPassword from '../components/ForgotPassword';

import { submit, modifyEmail } from '../controls/actions';

import {
  getLanguage,
  showTopAlert,
  closeTopAlert,
  setLanguageType
} from 'commonActions/actions';

export default connect(
  ({ forgotPassword, common }) => ({
    errorMessage: forgotPassword.errorMessage,
    email: forgotPassword.email,
    topAlertData: common.topAlertData,
    brandInfo: common.brandInfo
  }),
  {
    submit,
    modifyEmail,
    getLanguage,
    showTopAlert,
    closeTopAlert,
    setLanguageType
  }
)(ForgotPassword);
