import { connect } from 'react-redux';
import DepositRoot from '../components/DepositRoot';
import { showTopAlert } from 'commonActions/actions';
import { getDepositByUserId } from '../controls/actions';

export default connect(
  ({ common, usersetting: { agentDepositReport: { deposit_detail } } }) => ({
    depositDetail: deposit_detail,
    brandInfo: common.brandInfo,
    userInfo: common.userInfo
  }),
  {
    showTopAlert,
    getDepositByUserId
  }
)(DepositRoot);
