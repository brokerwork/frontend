import { connect } from 'react-redux';
import IntervalForm from '../components/IntervalForm';
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
  showTopAlert,
  updateSingleIntervalInfo
})(IntervalForm);