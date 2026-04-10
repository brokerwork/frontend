import { connect } from 'react-redux';
import Conditions from '../components/Conditions';

import {
  updateFieldConditions,
  getEarningSubLevelUsers,
  modifyParams,
  getoutStandingReportList,
  getTreeSearch,
  getSubTreeUsersById
} from '../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      outStandingReport: {
        outstanding_report_list,
        searchParams,
        searchFieldConditions,
        privilege_type,
        userLevel
      }
    }
  }) => {
    return {
      searchFieldConditions,
      outStandingReportList: outstanding_report_list,
      userRights: common.userRights,
      params: searchParams,
      privilegeType: privilege_type,
      userLevel
    };
  },
  {
    getoutStandingReportList,
    updateFieldConditions,
    getEarningSubLevelUsers,
    modifyParams,
    getTreeSearch,
    getSubTreeUsersById
  }
)(Conditions);
