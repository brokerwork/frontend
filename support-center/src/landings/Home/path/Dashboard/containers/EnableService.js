import { connect } from 'react-redux';
import { submit } from 'redux-form';
import EnableService from '../components/EnableService';
import {
  enableService,
  getEmailServiceInfo
} from '../controls/actions';
import {
  showTopAlert,
  getMenu
} from 'common/actions';


export default connect(({
  common: {
    tenantInfo
  },
  dashboard: {
    emailServiceInfo
  }
}) => ({
  tenantInfo,
  emailServiceInfo
}), {
  enableService,
  getEmailServiceInfo,
  showTopAlert,
  submitForm: submit,
  getMenu
})(EnableService);