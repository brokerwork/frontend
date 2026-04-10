import { connect } from 'react-redux';

import Report from './Report';
import {
  getServerList,
  updateCurrentServer,
  getLeverageList,
  getUserGroupList,
  getMTGroupList,
  getFormColumnsAccount,
  updateCurrentStatisticalReportType,
  getServerSymbols
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
      advancedSearchTypeReport: searchConditions.advancedSearchTypeReport,
      statisticalReportTypeList: searchConditions.statisticalReportTypeList,
      currentStatisticalReportType:
        searchConditions.currentStatisticalReportType,
      serverSymbols: searchConditions.serverSymbols,
      userRights
    };
  },
  {
    getServerList,
    updateCurrentServer,
    getLeverageList,
    getUserGroupList,
    getMTGroupList,
    getFormColumnsAccount,
    updateCurrentStatisticalReportType,
    getServerSymbols
  }
)(Report);
