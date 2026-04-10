import { connect } from 'react-redux';
import DepositModal from '../components/DepositModal';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import { submit } from 'redux-form';
import { updateDeposit } from '../controls/actions';

export default connect(
  ({}) => {
    return {};
  },
  {
    showTopAlert,
    showTipsModal,
    updateDeposit,
    submitForm: submit
  }
)(DepositModal);
