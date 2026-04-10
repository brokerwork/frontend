import { connect } from 'react-redux';
import Withdraw from '../components/Withdraw';
import { setParams } from '../controls/actions';

export default connect(
  ({
    settings: {
      depositWithdraw: { withdrawTypeList, params }
    }
  }) => ({
    withdrawTypeList,
    params
  }),
  {
    setParams
  }
)(Withdraw);
