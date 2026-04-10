import { connect } from 'react-redux';
import List from '../components/List';
import { getDepositList } from '../controls/actions';

export default connect(
  ({ deposit: { depositList } }) => ({
    depositList
  }),
  { getDepositList }
)(List);
