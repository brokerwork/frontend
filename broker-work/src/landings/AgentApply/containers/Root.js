import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Root from '../components/Root';
import {
  getFormField,
  getAgentConfig,
  submitAgentInfo,
  getUploadSign,
  getUploadSignToken,
  checkUserInfo
} from '../controls/actions';
import {
  showTopAlert,
  closeTopAlert,
  getLanguage,
  getBrandInfo,
  setLanguageType,
  getPhoneCountryCode,
  getCountry,
  showTipsModal,
  closeTipsModal,
  getAccessConfig
} from 'commonActions/actions';
import { AGENT_APPLY_BASE_INFO_FORM } from '../components/AgentApplyForm/BaseInfo';

export default connect(
  state => {
    const {
      agentApply: { agentConfig, formFields, uploadToken },
      common: { brandInfo, loading, topAlertData, tipsModalData, accessConfig }
    } = state;

    return {
      brandInfo,
      agentConfig,
      formFields,
      loading,
      topAlertData,
      tipsModalData,
      uploadToken,
      isAsyncValidating: (state.form[AGENT_APPLY_BASE_INFO_FORM] || {})
        .asyncValidating,
      accessConfig
    };
  },
  {
    getFormField,
    getBrandInfo,
    getAgentConfig,
    submitAgentInfo,
    submitForm: submit,
    showTopAlert,
    closeTopAlert,
    getLanguage,
    setLanguageType,
    getPhoneCountryCode,
    getCountry,
    getUploadSign,
    showTipsModal,
    closeTipsModal,
    getUploadSignToken,
    checkUserInfo,
    getAccessConfig
  }
)(Root);
