import { connect } from 'react-redux';
import { submit, getFormValues } from 'redux-form';

import Modify from '../components/TemplateModify';
import { TEMPLATE_FORM } from '../components/TemplateModify/TemplateForm';

import { showTopAlert, showTipsModal } from 'commonActions/actions';

import {
  createMessageTemplate,
  updateMessageTemplate,
  submitMessageTemplate
} from '../controls/actions.js';

export default connect(
  state => {
    const {
      settings: { messageTemplate },
      common
    } = state;
    return {
      messageType: messageTemplate.messageType,
      currentTemplate: messageTemplate.currentTemplate,
      userRights: common.userRights
      // currentFormInfo: getFormValues(TEMPLATE_FORM)(state)
    };
  },
  {
    createMessageTemplate,
    updateMessageTemplate,
    submitForm: submit,
    showTopAlert,
    showTipsModal,
    submitMessageTemplate
  }
)(Modify);
