import { connect } from 'react-redux';
import Login from '../components/Login';

import {
  submit,
  modifyParams,
  showLoginError,
  getAccessConfig,
  verifyAuthCode
} from '../controls/actions';

import {
  getBrandInfo,
  getLanguage,
  getCurrentUserRight,
  setLanguageType,
  logout,
  showTopAlert,
  getAccessConfig as getAccess,
  updateLoginIpInfo
} from 'commonActions/actions';

export default connect(
  ({ common, login }) => ({
    brandInfo: common.brandInfo,
    loginParams: login.loginParams,
    errorMessage: login.errorMessage,
    valideCode: login.valideCode,
    userRights: common.userRights,
    accessConfig: login.accessConfig
  }),
  {
    submit,
    modifyParams,
    getBrandInfo,
    getLanguage,
    getCurrentUserRight,
    setLanguageType,
    showLoginError,
    logout,
    getAccessConfig,
    verifyAuthCode,
    showTopAlert,
    getAccess,
    updateLoginIpInfo
  }
)(Login);
