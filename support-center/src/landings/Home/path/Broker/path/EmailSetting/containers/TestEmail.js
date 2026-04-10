import { connect } from 'react-redux';
import { submit } from 'redux-form';
import TestEmail from '../components/TestEmail';
import {
  showTopAlert
} from 'common/actions';
import {
  sendTestEmail
} from '../controls/actions';


export default connect(({
  brokerEmailSetting: {
    emailTarget
  },
  common
}) => ({
  emailTarget,
  tenantInfo: common.tenantInfo
}), {
  showTopAlert,
  submitForm: submit,
  sendTestEmail
})(TestEmail);