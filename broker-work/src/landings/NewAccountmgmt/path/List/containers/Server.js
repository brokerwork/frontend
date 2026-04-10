import Server from '../components/Actions/Server';
import { connect } from 'react-redux';
import { updateServer } from '../../../controls/actions';

export default connect(
  ({
    accountManagement: {
      serverList,
      currentServer,
      list: { currentPagination }
    }
  }) => ({
    serverList,
    currentServer,
    currentPagination
  }),
  { updateServer }
)(Server);
