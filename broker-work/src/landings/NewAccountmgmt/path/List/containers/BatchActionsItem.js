import BatchActionsItem from '../components/BatchActions/item';
import { connect } from 'react-redux';
import {
  updateSelectedAccountIds,
  removeAccount,
  getExportInfo,
  checkAccountCusAndTA
} from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
export default connect(
  ({
    common: { userRights },

    accountManagement: {
      currentServer,
      rights,
      list: { selectedAccountIds, currentPrivilegeType }
    }
  }) => ({
    currentServer,
    rights,
    userRights,
    selectedAccountIds,
    currentPrivilegeType
  }),
  {
    updateSelectedAccountIds,
    removeAccount,
    getExportInfo,
    showTopAlert,
    showTipsModal,
    checkAccountCusAndTA
  }
)(BatchActionsItem);
