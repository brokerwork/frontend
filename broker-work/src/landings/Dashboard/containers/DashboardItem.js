import { connect } from 'react-redux';
import DashboardItem from '../components/DashboardItem';
import {
  getMyDashboardItem,
  myDashboardData,
  setDashboardViewRight
} from './../controls/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      myDashboardArr,
      myDashboardData,
      dashboardViewRight,
      searchParams
    }
  }) => ({
    userRights,
    myDashboardArr,
    myDashboardData,
    dashboardViewRight,
    searchParams
  }),
  {
    getMyDashboardItem,
    myDashboardData,
    setDashboardViewRight
  }
)(DashboardItem);
