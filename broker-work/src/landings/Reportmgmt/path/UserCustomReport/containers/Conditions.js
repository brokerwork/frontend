import { connect } from 'react-redux';
import Conditions from '../components/Conditions';

import {
  updateFieldConditions,
  modifyParams,
  getEarningSubLevelUsers
} from '../controls/actions';
import {
  getReportSubLevelUsers
} from '../../../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      userCustomReportDetail: { searchParams, searchFieldConditions, privilege_type, advanceResourceData, serverSymbols, current_server, reportConfig, userLevel }
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
      reportConfig,
      userLevel
    };
  },
  {
    updateFieldConditions,
    modifyParams,
    getReportSubLevelUsers,
    getEarningSubLevelUsers
  }
)(Conditions);
