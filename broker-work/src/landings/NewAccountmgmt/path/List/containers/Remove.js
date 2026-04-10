import Remove from '../components/BatchActions/Remove';
import { connect } from 'react-redux';
import {
  checkAccountCusAndTA,
  removeAccount,
  updateSelectedAccountIds
} from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    accountManagement: {
      currentServer,
      list: { selectedAccountIds }
    }
  }) => ({
    selectedAccountIds,
    currentServer
  }),
  {
    checkAccountCusAndTA,
    removeAccount,
    showTopAlert,
    showTipsModal,
    updateSelectedAccountIds
  }
)(Remove);
