import Credit from '../components/Credit';
import { reset, submit } from 'redux-form';
import { connect } from 'react-redux';
import { getAccountDetail, updateCredit } from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    accountManagement: {
      currentServer,
      detail: { accountId, accountInfo }
    }
  }) => ({
    currentServer,
    accountId,
    accountInfo
  }),
  { getAccountDetail, updateCredit, showTopAlert, resetForm: reset, submit }
)(Credit);
