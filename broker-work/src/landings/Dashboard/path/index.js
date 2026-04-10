import { Route, withRouter, Switch } from 'react-router-dom';
import Achievements from './Achievements';
import CustomerSource from './CustomerSource';
import CustomerData from './CustomerData';

export default withRouter(({ match: { url } }) => {
  return (
    <Switch>
      <Route path={`${url}/achievements`} component={Achievements} />
      <Route path={`${url}/customer-source`} component={CustomerSource} />
      <Route path={`${url}/customer-data`} component={CustomerData} />
    </Switch>
  );
});
