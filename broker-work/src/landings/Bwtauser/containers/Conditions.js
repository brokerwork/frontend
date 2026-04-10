import { connect } from 'react-redux';
import Conditions from '../components/Conditions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

import {
  modifyParams,
  updateSelectedUsers,
  getUsers,
  deleteUsers,
  updateAdvancedLogicType,
  updateFieldConditions,
  updateCondition
} from '../controls/actions';

export default connect(
  ({
    common: { userRights },
    taUserMgmt: {
      params,
      selectedUsers,
      searchTypes,
      typesOptions,
      advancedSearchConditions,
      searchFieldConditions
    }
  }) => ({
    params,
    userRights,
    selectedUsers,
    searchTypes,
    typesOptions,
    advancedSearchConditions,
    searchFieldConditions
  }),
  {
    modifyParams,
    updateSelectedUsers,
    getUsers,
    showTipsModal,
    showTopAlert,
    deleteUsers,
    updateAdvancedLogicType,
    updateFieldConditions,
    updateCondition
  }
)(Conditions);
