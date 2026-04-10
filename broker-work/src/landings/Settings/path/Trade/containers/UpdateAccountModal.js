import { connect } from 'react-redux';
import UpdateAccountModal from '../components/UpdateAccountModal';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import { getAccountList, getBalance } from '../controls/actions';
import { submit } from 'redux-form';

export default connect(
  ({
    settings: { tradeMode: { tradeSetting, accountList, singleBalance } }
  }) => {
    return {
      accountList,
      singleBalance
    };
  },
  {
    showTopAlert,
    showTipsModal,
    getAccountList,
    getBalance,
    submitForm: submit
  }
)(UpdateAccountModal);
