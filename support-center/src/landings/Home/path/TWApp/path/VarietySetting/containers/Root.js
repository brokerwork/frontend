import { connect } from 'react-redux';
import Root from '../components/Root';
import { 
  getVendorInfo,
  getServerInfo
} from '../controls/actions';


export default connect(({
  varietySettings: {
    vendorInfo
  }
}) => ({
  vendorInfo
}), {
  getVendorInfo,
  getServerInfo
})(Root);