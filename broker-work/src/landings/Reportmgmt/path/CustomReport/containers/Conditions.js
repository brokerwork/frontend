import { connect } from 'react-redux';
import Conditions from '../components/Conditions';

import {
  updateFieldConditions,
  modifyParams,
  getTreeSearch,
  getSubTreeUsersById
} from '../controls/actions';
import { getReportSubLevelUsers } from '../../../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      customReportDetail: {
        searchParams,
        searchFieldConditions,
        privilege_type,
        advanceResourceData,
        serverSymbols,
        current_server,
        reportConfig
      }
    }
  }) => {
    return {
      searchFieldConditions,
      userRights: common.userRights,
      params: searchParams,
      privilegeType: privilege_type,
      advanceResourceData,
      serverSymbols,
      currentServer: current_server,
      reportConfig
    };
  },
  {
    updateFieldConditions,
    modifyParams,
    getReportSubLevelUsers,
    getTreeSearch,
    getSubTreeUsersById
  }
)(Conditions);
