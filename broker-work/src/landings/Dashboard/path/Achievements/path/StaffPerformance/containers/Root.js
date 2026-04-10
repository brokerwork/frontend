import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  getRankingsData,
  initialParams,
  resetData,
  modifyParams,
  modifyTablePagination,
  setDashboardViewRight
} from 'landings/Dashboard/controls/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      rankingsData,
      searchParams,
      paginationInfo,
      dashboardViewRight
    }
  }) => ({
    data: rankingsData,
    searchParams,
    paginationInfo,
    userRights,
    dashboardViewRight
  }),
  {
    getRankingsData,
    modifyParams,
    resetData,
    initialParams,
    modifyTablePagination,
    setDashboardViewRight
  }
)(Root);
