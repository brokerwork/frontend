import { connect } from 'react-redux';
import { submit } from 'redux-form';
import CustomerDetailModal from '../components/CustomerDetailModal';
import * as actions from '../controls/actions';

export default connect(
  ({
    customMgmt: {
      customers: {
        customerDetailInfo,
        customerLinkSource,
        customerStates,
        tenantType,
        selectableCustomerStateKeys,
        twUserOfCustomer
      }
    },
    common
  }) => ({
    customerDetailInfo,
    customerLinkSource,
    userRights: common.userRights,
    customerStates,
    tenantType,
    selectableCustomerStateKeys,
    twUserOfCustomer
  }),
  {
    ...actions,
    submitForm: submit
  }
)(CustomerDetailModal);
