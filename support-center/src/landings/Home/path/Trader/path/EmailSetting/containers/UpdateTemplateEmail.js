import { connect } from 'react-redux';
import { submit } from 'redux-form';
import UpdateTemplateEmail from '../components/UpdateTemplateEmail';
import {
  batchUpdateTemplateEmail
} from '../controls/actions';
import { showTopAlert } from 'common/actions';


export default connect(({
  traderEmailSetting: {
    emailList,
    selectedTemplate
  }
}) => ({
  emailList,
  selectedTemplate
}), {
  batchUpdateTemplateEmail,
  submitForm: submit,
  showTopAlert
})(UpdateTemplateEmail);
