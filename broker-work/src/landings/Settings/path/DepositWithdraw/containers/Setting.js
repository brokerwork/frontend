import { connect } from 'react-redux';
import Setting from '../components/Setting';
import {
  getDepositWithdrawInfo,
  enableStat,
  getStat
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
export default connect(
  ({
    settings: {
      depositWithdraw: { depositWithdrawInfo }
    }
  }) => ({
    depositWithdrawInfo
  }),
  {
    getDepositWithdrawInfo,
    enableStat,
    getStat,
    showTopAlert
  }
)(Setting);
