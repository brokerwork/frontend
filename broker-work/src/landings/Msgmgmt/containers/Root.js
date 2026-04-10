import { connect } from 'react-redux';
import Root from '../components/Root';
import { getBoxStatus } from '../controls/actions';

export default connect(
  ({ messages, common }) => ({
    boxStatus: messages.boxStatus,
    userRights: common.userRights,
    pageTitle: messages.pageTitle,
    brandInfo: common.brandInfo
  }),
  {
    getBoxStatus
  }
)(Root);
