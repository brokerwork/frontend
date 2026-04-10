import { connect } from 'react-redux';
import ValueAddedService from '../components/ValueAddedService';
import {
  disableService
} from '../controls/actions';
import {
  showTopAlert,
  showTipsModal,
  getTenantInfo,
  getMenu
} from 'common/actions';


export default connect(({
  common: {
    tenantInfo
  }
}) => ({
  tenantInfo
}), {
  disableService,
  showTipsModal,
  showTopAlert,
  getTenantInfo,
  getMenu
})(ValueAddedService);