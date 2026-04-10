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
  setDashboardViewRight,
  getTradeVarietyDistribute
} from 'landings/Dashboard/controls/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      searchParams,
      paginationInfo,
      trendData,
      dashboardViewRight,
      tradeVarietyDistributeData
    }
  }) => ({
    searchParams,
    userRights,
    trendData,
    paginationInfo,
    dashboardViewRight,
    tradeVarietyDistributeData
  }),
  {
    getTrendDatas,
    modifyParams,
    resetData,
    initialParams,
    getCustomerSources,
    modifyTablePagination,
    setDashboardViewRight,
    getTradeVarietyDistribute
  }
)(Root);
