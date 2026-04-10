import { connect } from 'react-redux';
import { submit } from 'redux-form';
import UpdateVariety from '../components/UpdateVariety';
import { 
  getVendorInfo,
  getServerInfo,
  saveServerInfo
} from '../controls/actions';
import { showTopAlert } from 'common/actions';


export default connect(({
  varietySettings: {
    vendorInfo
  }
}) => ({
  vendorInfo
}), {
  getVendorInfo,
  getServerInfo,
  saveServerInfo,
  submitForm: submit,
  showTopAlert
})(UpdateVariety);