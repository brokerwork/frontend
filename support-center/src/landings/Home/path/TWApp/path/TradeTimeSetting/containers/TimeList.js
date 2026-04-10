import { connect } from 'react-redux';
import TimeList from '../components/TimeList';
import { 
  getVendorInfo,
  getTimeInfo
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
  getTimeInfo
})(TimeList);