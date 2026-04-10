import { Switch, Route, Redirect } from 'react-router-dom';
import TransfomTrends from './path/TransfomTrends';
import TransfomFunnel from './path/TransfomFunnel';
import { connect } from 'react-redux';

const R = ({ match: { url }, userRights }) => {
  let subPage = '';
  if (userRights['DASHBOARD_TYPE_SOURCE_CON']) {
    subPage = 'transfom-trends';
  } else if (userRights['DASHBOARD_TYPE_SOURCE_FUNEL']) {
    subPage = 'transfom-funnel';
  }
  return (
    <Switch>
      <Route path={`${url}/transfom-trends`} component={TransfomTrends} />
      <Route path={`${url}/transfom-funnel`} component={TransfomFunnel} />
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
