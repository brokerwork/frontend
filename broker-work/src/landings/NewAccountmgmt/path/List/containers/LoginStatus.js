import LoginStatus from '../components/BatchActions/LoginStatus';
import { connect } from 'react-redux';
import { updateCellStatus } from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    accountManagement: {
      currentServer,
      resources,
      list: { selectedAccountIds }
    }
  }) => ({
    selectedAccountIds,
    currentServer,
    resources
  }),
  { updateCellStatus, showTopAlert, showTipsModal }
)(LoginStatus);
