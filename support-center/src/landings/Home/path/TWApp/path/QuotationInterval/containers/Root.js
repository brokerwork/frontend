import { connect } from 'react-redux';
import Root from '../components/Root';


import { 
  getIntervalInfo,
  updateIntervalInfo,
  getVendorInfo,
  getServerInfo
} from '../controls/actions';


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
  getServerInfo
})(Root);