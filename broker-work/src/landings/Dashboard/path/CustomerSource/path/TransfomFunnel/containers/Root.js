import { connect } from 'react-redux';
import Root from '../components/Root';
import { getBrandInfo } from 'commonActions/actions';
import {
  resetData,
  getCustomerSources,
  getTrendDetailData,
  modifyTablePagination,
  getTransferFunnel,
  modifyParams,
  initialParams,
  setDashboardViewRight
} from 'landings/Dashboard/controls/actions';

export default connect(
  ({
    common: { userRights },
    dashboard_my_dashboard: {
      searchParams,
      customerSourceOptions,
      trendDetailData,
      paginationInfo,
      transferFunnel,
      dashboardViewRight
    }
  }) => ({
    searchParams,
    trendDetailData,
    customerSourceOptions,
    paginationInfo,
    userRights,
    transferFunnel,
    dashboardViewRight
  }),
  {
    getBrandInfo,
    resetData,
    getTrendDetailData,
    getCustomerSources,
    modifyTablePagination,
    getTransferFunnel,
    modifyParams,
    initialParams,
    setDashboardViewRight
  }
)(Root);
