import * as actions from '../../../controls/actions';
import { connect } from 'react-redux';
import CommissionReportRoot from '../components/CommissionReportRoot';
import {
  updateCurrentCommissionReportType,
  getServerList,
  updateFieldConditions,
  getReportList,
  checkFailNum,
  modifyParams
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      base: { current_server },
      commissionReport: { searchParams, object_type }
    },
    common: { brandInfo }
  }) => ({
    currentServer: current_server,
    brandInfo,
    params: searchParams,
    objectType: object_type
  }),
  {
    getServerList,
    getReportList,
    updateCurrentCommissionReportType,
    updateFieldConditions,
    checkFailNum,
    modifyParams
  }
)(CommissionReportRoot);
