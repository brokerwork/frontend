import { connect } from 'react-redux';
import List from '../components/List';
import { showTipsModal } from 'commonActions/actions';

import {
  getUsers,
  modifyParams,
  updateSelectedUsers,
  updateLoginStatus,
  deleteUsers
} from '../controls/actions';

export default connect(
  ({
    common: { brandInfo, userRights },
    taUserMgmt: { users, params, paginationInfo, selectedUsers, typesOptions }
  }) => {
    return {
      brandInfo,
      users,
      params,
      paginationInfo,
      userRights,
      selectedUsers,
      typesOptions
    };
  },
  {
    getUsers,
    modifyParams,
    updateSelectedUsers,
    updateLoginStatus,
    showTipsModal,
    deleteUsers
  }
)(List);
