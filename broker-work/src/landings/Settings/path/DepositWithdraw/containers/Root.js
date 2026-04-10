import { connect } from 'react-redux';
import Root from '../components/Root';
import { getDepositWithdrawInfo } from '../controls/actions';

export default connect(null, {
  getDepositWithdrawInfo
})(Root);
