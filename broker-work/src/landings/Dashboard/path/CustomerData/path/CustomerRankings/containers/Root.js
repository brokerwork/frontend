import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  modifyParams,
  resetData,
  initialParams,
  getCustomerRankings,
  getAccountRankings,
  setDashboardViewRight
} from 'landings/Dashboard/controls/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      dashboardViewRight,
      searchParams,
      paginationInfo,
      customerRankings,
      accountRankings
    }
  }) => ({
    dashboardViewRight,
    searchParams,
    userRights,
    paginationInfo,
    customerRankings,
    accountRankings
  }),
  {
    modifyParams,
    resetData,
    initialParams,
    getCustomerRankings,
    getAccountRankings,
    setDashboardViewRight
  }
)(Root);
