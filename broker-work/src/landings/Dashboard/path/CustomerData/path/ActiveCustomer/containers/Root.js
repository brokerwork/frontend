import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  modifyParams,
  resetData,
  initialParams,
  modifyTablePagination,
  setDashboardViewRight,
  getTrendDatas
} from 'landings/Dashboard/controls/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      searchParams,
      paginationInfo,
      dashboardViewRight,
      trendData
    }
  }) => ({
    searchParams,
    paginationInfo,
    userRights,
    dashboardViewRight,
    trendData
  }),
  {
    modifyParams,
    resetData,
    initialParams,
    modifyTablePagination,
    setDashboardViewRight,
    getTrendDatas
  }
)(Root);
