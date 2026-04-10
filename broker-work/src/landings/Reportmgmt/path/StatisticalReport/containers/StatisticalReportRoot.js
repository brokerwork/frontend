import { connect } from 'react-redux';
import StatisticalReportRoot from '../components/StatisticalReportRoot';
import {
  updateCurrentStatisticalReportType,
  getServerList,
  getSymbolGroup,
  getResources,
  getServerSymbols,
  updateCurrentSortParam,
  modifyParams,
  updateFieldConditions
} from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      statisticalReport: { searchParams, privilege_type, current_server }
    },
    common: { brandInfo }
  }) => ({
    brandInfo,
    currentServer: current_server,
    params: searchParams,
    privilegeType: privilege_type
  }),
  {
    getServerList,
    updateCurrentStatisticalReportType,
    getSymbolGroup,
    getResources,
    getServerSymbols,
    updateCurrentSortParam,
    modifyParams,
    updateFieldConditions
  }
)(StatisticalReportRoot);
