import { connect } from 'react-redux';
import { submit } from 'redux-form';
import OfflineRecharge from '../components/OfflineRecharge';
import { offlineRecharge } from '../controls/actions';
import { showTopAlert } from 'common/actions';


export default connect(({
  common: {
    tenantInfo
  }
}) => ({
  tenantInfo
}), {
  offlineRecharge,
  showTopAlert,
  submitForm: submit
})(OfflineRecharge);