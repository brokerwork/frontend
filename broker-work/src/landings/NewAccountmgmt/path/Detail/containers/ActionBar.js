import ActionBar from '../components/ActionBar';
import { connect } from 'react-redux';

export default connect(
  ({
    common: { userRights },
    accountManagement: {
      detail: { accountInfo, isBlackUser },
      currentServer
    }
  }) => ({
    accountInfo,
    currentServer,
    userRights,
    isBlackUser
  })
)(ActionBar);
