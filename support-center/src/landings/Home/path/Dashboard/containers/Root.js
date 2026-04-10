import { connect } from 'react-redux';
import Root from '../components/Root';
import { 
  getRechargePlatform,
  getExchangeRate
} from '../controls/actions';


export default connect(({
  common: {
    tenantInfo
  }
}) => ({
  tenantInfo
}), {
  getRechargePlatform,
  getExchangeRate
})(Root);