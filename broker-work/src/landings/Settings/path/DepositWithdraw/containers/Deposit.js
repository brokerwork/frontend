import { connect } from 'react-redux';
import Deposit from '../components/Deposit';
import { setParams } from '../controls/actions';

export default connect(
  ({
    settings: {
      depositWithdraw: { depositTypeList, params }
    }
  }) => ({
    depositTypeList,
    params
  }),
  {
    setParams
  }
)(Deposit);
