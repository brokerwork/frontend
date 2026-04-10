import { connect } from 'react-redux';
import { submit } from 'redux-form';
import SynchronizeModal from '../components/SynchronizeModal';
import { showTipsModal, showTopAlert } from 'common/actions';
import { 
  getVendorInfo,
  getTimeInfo,
  saveTimeSingle
} from '../controls/actions';


export default connect(({
  tradeTimeSetting: {
    vendorInfo,
    timeInfo
  }
}) => ({
  vendorInfo,
  timeInfo
}), {
  getVendorInfo,
  getTimeInfo,
  submitForm: submit,
  saveTimeSingle,
  showTopAlert,
  showTipsModal
})(SynchronizeModal);