import Ownership from '../components/BatchActions/Ownership';
import { connect } from 'react-redux';
import { updateOwnership } from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({ accountManagement: { currentServer, list: { selectedAccountIds } } }) => ({
    selectedAccountIds,
    currentServer
  }),
  { updateOwnership, showTopAlert }
)(Ownership);
