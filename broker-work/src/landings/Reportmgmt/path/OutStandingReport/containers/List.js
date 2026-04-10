import { connect } from 'react-redux';
import OutstandingList from '../components/List';
import {
  getoutStandingReportList,
  updatePagination,
  modifyParams
} from '../controls/actions';

export default connect(
  ({
    common,
    reportManagement: {
      outStandingReport: {
        outstanding_report_list,
        searchParams,
        privilege_type,
        paginationInfo
      }
    }
  }) => {
    return {
      brandInfo: common.brandInfo,
      userRights: common.userRights,
      outStandingReportList: outstanding_report_list,
      params: searchParams,
      privilegeType: privilege_type,
      paginationInfo
    };
  },
  {
    getoutStandingReportList,
    updatePagination,
    modifyParams
  }
)(OutstandingList);
