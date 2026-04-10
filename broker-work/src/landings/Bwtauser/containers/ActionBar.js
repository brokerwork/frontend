import { connect } from 'react-redux';
import ActionBar from '../components/ActionBar';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

import {
  modifyParams,
  updateSelectedUsers,
  getUsers,
  deleteUsers
} from '../controls/actions';

export default connect(
  ({
    common: { userRights },
    taUserMgmt: {
      params,
      selectedUsers,
      searchTypes,
      typesOptions,
      paginationInfo,
      listUpdateTime
    }
  }) => ({
    params,
    userRights,
    selectedUsers,
    searchTypes,
    typesOptions,
    paginationInfo,
    listUpdateTime
  }),
  {
    modifyParams,
    updateSelectedUsers,
    getUsers,
    showTipsModal,
    showTopAlert,
    deleteUsers
  }
)(ActionBar);
