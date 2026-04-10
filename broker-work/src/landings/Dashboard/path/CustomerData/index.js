import { Switch, Route, Redirect } from 'react-router-dom';
import Customers from './path/Customers';
import CustomerRankings from './path/CustomerRankings';
import ActiveCustomer from './path/ActiveCustomer';
import CustomerDormant from './path/CustomerDormant';
import TradeVarietyDistribute from './path/TradeVarietyDistribute';
import { connect } from 'react-redux';

const R = ({ match: { url }, userRights }) => {
  let subPage = '';
  if (userRights['DASHBOARD_TYPE_CDA_CP']) {
    subPage = 'customers';
  } else if (userRights['DASHBOARD_TYPE_CDA_TAR']) {
    subPage = 'customer-rankings';
  } else if (userRights['DASHBOARD_TYPE_CDA_AC']) {
    subPage = 'active-customer';
  } else if (userRights['DASHBOARD_TYPE_CDA_DC']) {
    subPage = 'customer-dormant';
  } else if (userRights['DASHBOARD_TYPE_CDA_DT']) {
    subPage = 'trade-variety-distribute';
  }
  return (
    <Switch>
      <Route path={`${url}/customers`} component={Customers} />
      <Route path={`${url}/customer-rankings`} component={CustomerRankings} />
      <Route path={`${url}/active-customer`} component={ActiveCustomer} />
      <Route path={`${url}/customer-dormant`} component={CustomerDormant} />
      <Route
        path={`${url}/trade-variety-distribute`}
        component={TradeVarietyDistribute}
      />
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
