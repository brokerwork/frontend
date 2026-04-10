import Leverage from '../components/BatchActions/Leverage';
import { connect } from 'react-redux';
import { updateLeverage } from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import { submit } from 'redux-form';

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
  { updateLeverage, showTopAlert, showTipsModal, submitForm: submit }
)(Leverage);
