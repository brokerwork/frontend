import { connect } from 'react-redux';
import Detail from '../components/Detail';
import { getDepositDetail } from '../controls/actions';

export default connect(
  ({ deposit: { depositDetail } }) => ({
    depositDetail
  }),
  {
    getDepositDetail
  }
)(Detail);
