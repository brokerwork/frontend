import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  getTrendDatas,
  modifyParams,
  resetData,
  initialParams,
  getCustomerSources,
  modifyTablePagination,
  getSumData,
  setDashboardViewRight
} from 'landings/Dashboard/controls/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      searchParams,
      paginationInfo,
      trendData,
      sumData,
      dashboardViewRight
    }
  }) => ({
    searchParams,
    userRights,
    trendData,
    paginationInfo,
    sumData,
    dashboardViewRight
  }),
  {
    getSumData,
    getTrendDatas,
    modifyParams,
    resetData,
    initialParams,
    getCustomerSources,
    modifyTablePagination,
    setDashboardViewRight
  }
)(Root);
