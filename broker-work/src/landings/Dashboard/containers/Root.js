import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  getCollections,
  getMyDashboard,
  getMyDashboardItem,
  saveMyDashboard,
  modifyParams,
  setDashboardViewRight
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      collectionsDashboards,
      myDashboardData,
      myDashboardArr,
      searchParams,
      dashboardViewRight
    }
  }) => ({
    collectionsDashboards,
    myDashboardData,
    myDashboardArr,
    searchParams,
    userRights,
    dashboardViewRight
  }),
  {
    getMyDashboardItem,
    getCollections,
    getMyDashboard,
    saveMyDashboard,
    showTopAlert,
    modifyParams,
    setDashboardViewRight
  }
)(Root);
