import { connect } from 'react-redux';
import TransferCustomer from '../components/TransferCustomer';
import * as actions from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ customMgmt: { customers: { selectedItemsMap } } }) => ({
    selectedItemsMap
  }),
  {
    ...actions,
    showTopAlert,
    showTipsModal
  }
)(TransferCustomer);
