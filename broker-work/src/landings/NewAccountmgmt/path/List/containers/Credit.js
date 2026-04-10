import Credit from '../components/BatchActions/Credit';
import { connect } from 'react-redux';
import { updateBalance } from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(
  ({ accountManagement: { currentServer, list: { selectedAccountIds } } }) => ({
    selectedAccountIds,
    currentServer
  }),
  { updateBalance, showTopAlert, showTipsModal, submitForm: submit }
)(Credit);
