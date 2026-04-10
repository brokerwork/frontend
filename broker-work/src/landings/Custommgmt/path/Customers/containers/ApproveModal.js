import { connect } from 'react-redux';
import ApproveModal from '../components/CustomerDetail/ApproveModal';
import { showTopAlert } from 'commonActions/actions';
import { submit } from 'redux-form';
import { submitApprove } from '../controls/actions';

export default connect(({ customMgmt: {} }) => ({}), {
  showTopAlert,
  submitForm: submit,
  submitApprove
})(ApproveModal);
