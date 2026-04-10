import { connect } from 'react-redux';
import Conditions from '../components/Conditions';
import {
  getUserGroupList,
  getMTGroupList,
  getServerSymbols
} from '../../../controls/actions';

import {
  getReportList,
  updateFieldConditions,
  updateCondition,
  getReportSubLevelUsers,
  getServerList,
  updateCurrentStatisticalReportType,
  modifyParams,
  getTreeSearch,
  getSubTreeUsersById,
  updateCurrentSortParam
} from '../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      base: {
        search_type,
        advancedLogicType,
        advancedSearchConditions,
        userGroupList,
        mtGroupList
      },
      statisticalReport: {
        report_list,
        server_list,
        current_server,
        current_statistical_report_type,
        advancedSearchType,
        searchParams,
        searchFieldConditions,
        currentCondition,
        privilege_type,
        serverSymbols,
        symbol_group,
        statistical_list_columns
      }
    }
  }) => {
    return {
      serverList: server_list,
      currentServer: current_server,
      currentStatisticalReportType: current_statistical_report_type,
      symbolGroup: symbol_group,
      statisticalListColumns: statistical_list_columns,
      searchType: search_type,
      searchFieldConditions,
      reportList: report_list,
      advancedLogicType,
      advancedSearchType,
      advancedSearchConditions,
      userRights: common.userRights,
      userGroupList,
      serverSymbols,
      mtGroupList,
      currentCondition,
      params: searchParams,
      privilegeType: privilege_type
    };
  },
  {
    getReportList,
    getUserGroupList,
    getMTGroupList,
    getServerSymbols,
    updateFieldConditions,
    updateCondition,
    getReportSubLevelUsers,
    getServerList,
    updateCurrentStatisticalReportType,
    modifyParams,
    getTreeSearch,
    getSubTreeUsersById,
    updateCurrentSortParam
  }
)(Conditions);
