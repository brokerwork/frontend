import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  getAccessSetting,
  updateAccessSetting,
  rightFunction
} from '../../../controls/actions';
import { submit, reset } from 'redux-form';
import {
  showTopAlert
} from 'common/actions';

export default connect(({
  brokerCommon: {
    accessSetting,
    brokerRights
  }
}) => ({
  accessSetting,
  brokerRights
}), {
  getAccessSetting,
  submitForm: submit,
  reset,
  updateAccessSetting,
  showTopAlert,
  rightFunction
})(Root);