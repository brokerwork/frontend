import { connect } from 'react-redux';
import Conditions from '../components/Conditions';
import {
  updateFieldConditions,
  updateCondition,
  getComissionSubLevelUsers,
  getReportList,
  getServerList,
  modifyParams,
  getTreeSearch,
  getSubTreeUsersById
} from '../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      base: { advancedLogicType },
      commissionReport: {
        report_list,
        listUpdateTime,
        advancedSearchType,
        searchParams,
        object_type,
        searchFieldConditions,
        current_commission_report_type
      }
    }
  }) => {
    return {
      searchFieldConditions,
      reportList: report_list,
      advancedLogicType,
      advancedSearchType,
      userRights: common.userRights,
      params: searchParams,
      listUpdateTime,
      objectType: object_type,
      searchFieldConditions,
      currentCommissionReportType: current_commission_report_type,
      brandInfo: common.brandInfo
    };
  },
  {
    updateFieldConditions,
    updateCondition,
    getComissionSubLevelUsers,
    getReportList,
    getServerList,
    modifyParams,
    getTreeSearch,
    getSubTreeUsersById
  }
)(Conditions);
