import { connect } from 'react-redux';
import Root from '../components/Root';
import { 
  getVendorInfo,
  getTimeInfo,
  saveTimeSynchronize
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'common/actions';


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
  showTipsModal,
  showTopAlert,
  saveTimeSynchronize
})(Root);