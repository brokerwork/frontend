import { connect } from 'react-redux';
import AddForm from '../components/AddForm';
import {
  saveMsg,
  sendMsg,
  modifyParams,
  getTemplates,
  getAvaliableEmails,
  modifyTemplate,
  modifyMessageType,
  modifySendObjectOptions,
  getMessageDetails,
  resetForm,
  warningCheck,
  checkBalance
} from '../controls/actions';

import { showTopAlert } from 'commonActions/actions';

import { setPageTitle } from '../../../controls/actions';

export default connect(
  ({ messages: { addMessage }, common: { userInfo, userRights } }) => ({
    messageParams: addMessage.messageParams,
    templates: addMessage.templates,
    avaliableEmails: addMessage.avaliableEmails,
    loginUserName: userInfo.name,
    sendObjectOptions: addMessage.sendObjectOptions,
    typesOptions: addMessage.typesOptions,
    userRights: userRights,
    checkResponse: addMessage.checkResponse
  }),
  {
    saveMsg,
    sendMsg,
    modifyParams,
    getTemplates,
    getAvaliableEmails,
    modifyTemplate,
    modifyMessageType,
    modifySendObjectOptions,
    getMessageDetails,
    showTopAlert,
    resetForm,
    setPageTitle,
    warningCheck,
    checkBalance
  }
)(AddForm);
