import { connect } from 'react-redux';
import List from '../components/List';
import { getDepositList } from '../controls/actions';

export default connect(
  ({ batchWithdraw: { depositList } }) => ({
    depositList
  }),
  { getDepositList }
)(List);
