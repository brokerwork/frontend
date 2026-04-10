import { Switch, Route, Redirect } from 'react-router-dom';
import NewCustomers from './path/NewCustomers';
import Trade from './path/Trade';
import TotalCustomers from './path/TotalCustomers';
import Commission from './path/Commission';
import StaffPerfomance from './path/StaffPerformance';
import { connect } from 'react-redux';

const R = ({ match: { url }, userRights }) => {
  let subPage = '';
  if (userRights['DASHBOARD_TYPE_PFS_NC']) {
    subPage = 'new-customers';
  } else if (userRights['DASHBOARD_TYPE_PFS_CC']) {
    subPage = 'total-customers';
  } else if (userRights['DASHBOARD_TYPE_PFS_FUND']) {
    subPage = 'trade';
  } else if (userRights['DASHBOARD_TYPE_PFS_COMMISSION']) {
    subPage = 'commission';
  } else if (userRights['DASHBOARD_TYPE_PFS_RANK']) {
    subPage = 'staff-performance';
  }
  return (
    <Switch>
      <Route path={`${url}/new-customers`} component={NewCustomers} />
      <Route path={`${url}/trade`} component={Trade} />
      <Route path={`${url}/total-customers`} component={TotalCustomers} />
      <Route path={`${url}/commission`} component={Commission} />
      <Route path={`${url}/staff-performance`} component={StaffPerfomance} />
      <Redirect from={`${url}`} to={`${url}/${subPage}`} />
    </Switch>
  );
};

export default connect(
  ({ common: { userRights } }) => ({
    userRights
  }),
  {}
)(R);
