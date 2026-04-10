import { connect } from 'react-redux';
import Root from '../components/Root';
import { getMessageDetails } from '../controls/actions';

import { setPageTitle } from '../../../controls/actions';

export default connect(
  ({ messages: { details }, common: { userInfo, userRights } }) => ({
    data: details.details,
    userInfo: userInfo,
    userRights
  }),
  {
    getMessageDetails,
    setPageTitle
  }
)(Root);
