import { connect } from 'react-redux';
import AccountGroupSetting from '../components/Root';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

import {
  addAccountGroup,
  editAccountGroup,
  deleteAccountGroup,
  getAccountGroupList,
  updateCurrentGroup,
  checkAccountGroup
} from '../controls/actions';

export default connect(
  ({ settings: { account } }) => {
    return {
      groupList: account.group_list,
      currentGroup: account.current_group
    };
  },
  {
    showTopAlert,
    showTipsModal,
    addAccountGroup,
    editAccountGroup,
    deleteAccountGroup,
    getAccountGroupList,
    updateCurrentGroup,
    checkAccountGroup
  }
)(AccountGroupSetting);
