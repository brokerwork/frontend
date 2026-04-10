import { connect } from 'react-redux';
import Root from '../components/Root';

export default connect(
  ({ common }) => ({
    brandInfo: common.brandInfo
  }),
  null
)(Root);
