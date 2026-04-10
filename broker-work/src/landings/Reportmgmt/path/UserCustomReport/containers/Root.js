import { connect } from 'react-redux';
import Root from '../components/Root';
import { showTopAlert } from 'commonActions/actions';
import {
  getServerList,
  getServerSymbols,
  getResources,
  getReportConfig,
  initialParams,
  updateFieldConditions,
  updateCurrentServer,
  getUserLevel
} from '../controls/actions';

export default connect(
  ({
    common: { brandInfo },
    reportManagement: {
      userCustomReportDetail: { searchParams, reportConfig, privilege_type }
    }
  }) => ({
    brandInfo,
    searchParams,
    reportConfig,
    privilegeType: privilege_type
  }),
  {
    showTopAlert,
    getServerList,
    getServerSymbols,
    getResources,
    getReportConfig,
    initialParams,
    updateFieldConditions,
    updateCurrentServer,
    getUserLevel
  }
)(Root);
