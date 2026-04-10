import { connect } from 'react-redux';
import AccountGroup from '../components/AccountGroup';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

import {
  getAccountGroupConfig,
  updateAccountGroupConfig
} from '../controls/actions';

export default connect(
  ({
    settings: {
      account: { groupConfig }
    }
  }) => {
    return {
      groupConfig
    };
  },
  {
    showTopAlert,
    showTipsModal,
    getAccountGroupConfig,
    updateAccountGroupConfig
  }
)(AccountGroup);
