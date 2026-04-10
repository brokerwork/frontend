import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  getTrendDatas,
  modifyParams,
  resetData,
  initialParams,
  modifyTablePagination,
  setDashboardViewRight,
  getDepositDistribute
} from 'landings/Dashboard/controls/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      trendData,
      searchParams,
      paginationInfo,
      dashboardViewRight,
      depositDistributeData
    }
  }) => ({
    data: trendData,
    searchParams,
    paginationInfo,
    userRights,
    dashboardViewRight,
    depositDistributeData
  }),
  {
    getTrendDatas,
    modifyParams,
    resetData,
    initialParams,
    modifyTablePagination,
    setDashboardViewRight,
    getDepositDistribute
  }
)(Root);
