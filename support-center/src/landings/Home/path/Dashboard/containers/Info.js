import { connect } from 'react-redux';
import Info from '../components/Info';
import { 
  showTipsModal, 
  getTenantInfo 
} from 'common/actions';


export default connect(({
  common: {
    tenantInfo
  }
}) => ({
  tenantInfo
}), {
  showTipsModal,
  getTenantInfo
})(Info);