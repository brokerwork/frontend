import { connect } from 'react-redux';
import Contact from '../components/Contact';
import { showTipsModal, showTopAlert, getTenantInfo } from 'common/actions';
import { removeContact } from '../controls/actions';


export default connect(({
  common: {
    tenantInfo
  }
}) => ({
  tenantInfo
}), {
  showTipsModal,
  showTopAlert,
  removeContact,
  getTenantInfo
})(Contact);