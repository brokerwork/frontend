import { connect } from 'react-redux';
import { submit, formValueSelector } from 'redux-form';
import OperateEmail from '../components/OperateEmail';
import {
  showTopAlert
} from 'common/actions';
import {
  createEmail,
  updateEmail,
  getEmailList,
  _setEmailTarget
} from '../controls/actions';
import { EMAIL_FORM } from '../components/Forms/Email';

const selector = formValueSelector(EMAIL_FORM);

export default connect((state) => {
  const {
    emailProvider,
    emailTarget,
    securityType
  } = state.brokerEmailSetting;

  return {
    emailProvider,
    securityType,
    emailTarget,
    emailFromName: selector(state, 'fromName')
  };
}, {
  showTopAlert,
  submitForm: submit,
  createEmail,
  updateEmail,
  getEmailList,
  _setEmailTarget
})(OperateEmail);