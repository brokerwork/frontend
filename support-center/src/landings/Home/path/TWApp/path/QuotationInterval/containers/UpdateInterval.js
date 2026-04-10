import { connect } from 'react-redux';
import { submit } from 'redux-form';
import UpdateInterval from '../components/UpdateInterval';
import { 
  getIntervalInfo,
  updateIntervalInfo,
  getVendorInfo,
  getServerInfo,
  updateSingleIntervalInfo
} from '../controls/actions';
import { showTopAlert } from 'common/actions';


export default connect(({
  quotationInterval: {
    intervalInfo,
    vendorInfo,
    serverInfo
  }
}) => ({
  intervalInfo,
  vendorInfo,
  serverInfo
}), {
  getIntervalInfo,
  updateIntervalInfo,
  getVendorInfo,
  getServerInfo,
  submitForm: submit,
  showTopAlert,
  updateSingleIntervalInfo
})(UpdateInterval);