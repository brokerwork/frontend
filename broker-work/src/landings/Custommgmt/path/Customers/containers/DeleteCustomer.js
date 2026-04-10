import { connect } from 'react-redux';
import DeleteCustomer from '../components/DeleteCustomer';
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
)(DeleteCustomer);
