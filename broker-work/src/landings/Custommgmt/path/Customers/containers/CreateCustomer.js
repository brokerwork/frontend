import { connect } from 'react-redux';
import { submit } from 'redux-form';
import * as actions from '../controls/actions';
import CreateCustomer from '../components/CreateCustomer';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    common,
    customMgmt: { contacts, customers: { customerFormFields } }
  }) => ({
    customerFormFields: customerFormFields,
    contactFormFields: contacts.formColumns,
    userInfo: common.userInfo
  }),
  {
    ...actions,
    showTipsModal,
    showTopAlert,
    submitForm: submit
  }
)(CreateCustomer);
