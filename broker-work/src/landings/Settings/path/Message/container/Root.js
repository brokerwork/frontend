import { connect } from 'react-redux';

import Root from '../components/Root';
import * as actions from '../controls/actions.js';

import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ settings: { messageTemplate }, common }) => {
    return {
      data: messageTemplate.messageTemplates,
      params: messageTemplate.params,
      messageType: messageTemplate.messageType,
      currentTemplate: messageTemplate.currentTemplate,
      userRights: common.userRights
    };
  },
  {
    ...actions,
    showTopAlert,
    showTipsModal
  }
)(Root);
