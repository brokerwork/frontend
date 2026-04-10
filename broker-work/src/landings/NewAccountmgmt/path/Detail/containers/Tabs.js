import Tabs from '../components/Tabs';
import { connect } from 'react-redux';

export default connect(
  ({ accountManagement: { currentServer, rights } }) => ({
    currentServer,
    rights
  }),
  null
)(Tabs);
