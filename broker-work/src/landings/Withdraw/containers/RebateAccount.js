import { connect } from 'react-redux';
import RebateAccount from '../components/RebateAccount';
import {
  getRebateAccount,
  getWithdrawConfig,
  getBankList,
  getApplications
} from '../controls/actions';

export default connect(
  ({
    common,
    withDraw: { rebateAccount, withDrawConfig, applications, params }
  }) => ({
    rebateAccount,
    withDrawConfig,
    applications,
    params,
    brandInfo: common.brandInfo
  }),
  {
    getRebateAccount,
    getWithdrawConfig,
    getBankList,
    getApplications
  }
)(RebateAccount);
