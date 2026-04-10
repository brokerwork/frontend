import { connect } from 'react-redux';
import Recharge from '../components/Recharge';
import { submit } from 'redux-form';
import {
  onlineRecharge
} from '../controls/actions';
import {
  showTopAlert
} from 'common/actions';


export default connect(({
  common: {
    tenantInfo
  },
  monthlyflowreport: {
    platformList,
    exchangeRate
  }
}) => ({
  tenantInfo,
  platformList,
  exchangeRate
}), {
  onlineRecharge,
  submitForm: submit,
  showTopAlert
})(Recharge);