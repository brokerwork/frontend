import { connect } from 'react-redux';
import Recharge from '../components/Recharge';
import {
  getRechargeRecord,
  cancelOrder,
  payOrder
} from '../controls/actions';
import {
  showTipsModal
} from 'common/actions';


export default connect(({
  consumption: {
    rechargeRecord,
    rechargeType,
    rechargeTypeRechargeStatus,
    rechargeTypeRemittingStatus
  }
}) => ({
  rechargeRecord,
  rechargeType,
  rechargeTypeRechargeStatus,
  rechargeTypeRemittingStatus
}), {
  getRechargeRecord,
  cancelOrder,
  payOrder,
  showTipsModal
})(Recharge);