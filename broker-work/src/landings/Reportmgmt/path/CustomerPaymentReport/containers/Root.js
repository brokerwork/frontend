import * as actions from '../controls/actions';
import { connect } from 'react-redux';
import Root from '../components/Root';

export default connect(
  ({
    reportManagement: { customerPayment: { params } },
    common: { brandInfo }
  }) => ({
    params
  }),
  {
    ...actions
  }
)(Root);
