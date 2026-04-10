import { connect } from 'react-redux';
import Root from '../components/Root';
import { 
  getTenantInfo
} from 'common/actions';

export default connect(({
  common: {
    menus,
    tenantInfo
  }
}) => ({
  menus,
  tenantInfo
}), {
  getTenantInfo
})(Root);