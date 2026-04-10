import Leverage from '../components/Leverage';
import { connect } from 'react-redux';
import { getAccountDetail, updateLeverage } from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import { submit } from 'redux-form';
export default connect(
  ({
    accountManagement: {
      currentServer,
      resources,
      detail: { accountId, accountInfo }
    }
  }) => ({
    currentServer,
    resources,
    accountId,
    accountInfo
  }),
  { getAccountDetail, updateLeverage, showTopAlert, submit }
)(Leverage);
