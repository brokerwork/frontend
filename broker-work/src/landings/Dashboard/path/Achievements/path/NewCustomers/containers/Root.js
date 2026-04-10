import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  getTrendDatas,
  modifyParams,
  resetData,
  initialParams,
  modifyTablePagination,
  setDashboardViewRight,
  getMyDashboard,
  saveMyDashboard
} from 'landings/Dashboard/controls/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      trendData,
      searchParams,
      paginationInfo,
      dashboardViewRight,
      myDashboardArr
    }
  }) => ({
    data: trendData,
    searchParams,
    paginationInfo,
    userRights,
    dashboardViewRight,
    myDashboardArr
  }),
  {
    modifyParams,
    resetData,
    initialParams,
    getTrendDatas,
    modifyTablePagination,
    setDashboardViewRight,
    getMyDashboard,
    saveMyDashboard
  }
)(Root);
