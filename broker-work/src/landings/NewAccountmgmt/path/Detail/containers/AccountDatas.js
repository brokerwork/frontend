import AccountDatas from '../components/AccountDatas';
import { connect } from 'react-redux';
import { updateAccountInfoField } from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    accountManagement: {
      currentServer,
      resources,
      detail: { accountInfo, accountId }
    }
  }) => ({
    resources,
    currentServer,
    accountInfo,
    accountId
  }),
  { updateAccountInfoField, showTopAlert }
)(AccountDatas);
