import { connect } from 'react-redux';
import RechargeDetail from '../components/RechargeDetail';


export default connect(({
  consumption: {
    rechargeType,
    rechargeTypeRechargeStatus,
    rechargeTypeRemittingStatus
  }
}) => ({
  rechargeType,
  rechargeTypeRechargeStatus,
  rechargeTypeRemittingStatus
}), {})(RechargeDetail);