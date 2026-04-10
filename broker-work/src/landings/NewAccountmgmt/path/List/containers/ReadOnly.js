import ReadOnly from '../components/BatchActions/ReadOnly';
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
)(ReadOnly);
