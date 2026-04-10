import BatchActions from '../components/BatchActions';
import { connect } from 'react-redux';
import { updateSelectedAccountIds } from '../controls/actions';

export default connect(
  ({
    common: { userRights },
    accountManagement: {
      currentServer,
      rights,
      list: { selectedAccountIds, currentPrivilegeType }
    }
  }) => ({
    currentServer,
    rights,
    selectedAccountIds,
    currentPrivilegeType,
    userRights
  }),
  { updateSelectedAccountIds }
)(BatchActions);
