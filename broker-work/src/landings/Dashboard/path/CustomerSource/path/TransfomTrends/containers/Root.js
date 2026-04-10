import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  getHistoryData,
  getRankingsData,
  modifyParams,
  resetData,
  initialParams,
  getCustomerSources,
  modifyTablePagination,
  setDashboardViewRight
} from 'landings/Dashboard/controls/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      historyData,
      searchParams,
      rankingsData,
      customerSourceOptions,
      paginationInfo,
      dashboardViewRight
    }
  }) => ({
    historyData,
    rankingsData,
    searchParams,
    customerSourceOptions,
    paginationInfo,
    userRights,
    dashboardViewRight
  }),
  {
    getHistoryData,
    getRankingsData,
    modifyParams,
    resetData,
    initialParams,
    getCustomerSources,
    modifyTablePagination,
    setDashboardViewRight
  }
)(Root);
