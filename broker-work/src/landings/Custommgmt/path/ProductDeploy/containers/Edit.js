import { connect } from 'react-redux';
import Edit from '../components/Edit';
import * as actions from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(({ customMgmt: {} }) => ({}), {
  ...actions,
  showTopAlert,
  submitForm: submit
})(Edit);
