import { connect } from 'react-redux';

import Account from './Account';
import {
  getServerList,
  updateCurrentServer,
  getLeverageList,
  getUserGroupList,
  getMTGroupList,
  getFormColumnsAccount
} from '../../controls/actions.js';

export default connect(
  ({ common: { userRights }, settings: { searchConditions } }) => {
    return {
      conditionsList: searchConditions.conditionsList,
      currentServer: searchConditions.currentServer,
      mtGroupList: searchConditions.mtGroupList,
      userGroupList: searchConditions.userGroupList,
      leverageList: searchConditions.leverageList,
      serverList: searchConditions.serverList,
      advancedSearchTypeAccount: searchConditions.advancedSearchTypeAccount,
      userRights
    };
  },
  {
    getServerList,
    updateCurrentServer,
    getLeverageList,
    getUserGroupList,
    getMTGroupList,
    getFormColumnsAccount
  }
)(Account);
