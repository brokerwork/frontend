import { connect } from 'react-redux';
import QuotationIntervalSetting from '../components/QuotationIntervalSetting';
import { 
  getIntervalInfo,
  updateIntervalInfo,
  getVendorInfo,
  getServerInfo
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
  showTopAlert
})(QuotationIntervalSetting);