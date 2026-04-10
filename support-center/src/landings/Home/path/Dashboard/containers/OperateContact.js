import { connect } from 'react-redux';
import OperateContact from '../components/OperateContact';
import { submit } from 'redux-form';
import { operateContact } from '../controls/actions';
import { showTopAlert } from 'common/actions';


export default connect(null, {
  operateContact,
  submitForm: submit,
  showTopAlert
})(OperateContact);