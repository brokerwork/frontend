import Server from '../components/ActionsBar/Server';
import { connect } from 'react-redux';
import { updateCurrentServer } from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      userCustomReportDetail: { server_list, current_server }
    }
  }) => ({
    serverList: server_list,
    currentServer: current_server
  }),
  { updateCurrentServer }
)(Server);
