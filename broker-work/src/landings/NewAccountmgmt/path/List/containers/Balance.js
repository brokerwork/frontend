import Balance from '../components/BatchActions/Balance';
import { connect } from 'react-redux';
import { updateBalance, runDepositExcel } from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(
  ({ accountManagement: { currentServer, list: { selectedAccountIds } } }) => ({
    selectedAccountIds,
    currentServer
  }),
  {
    updateBalance,
    showTopAlert,
    showTipsModal,
    submitForm: submit,
    runDepositExcel
  }
)(Balance);
