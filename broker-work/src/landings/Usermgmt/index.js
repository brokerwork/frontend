import Users from './containers/Users';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';
import { Switch, Route, Redirect } from 'react-router-dom';

injectReducer('userManagement', reducers);

export default ({ match, history, ...props }) => {
  // return (
  //   <Switch>
  //     <Route
  //       path={`${match.path}/:userId`}
  //       render={_props => <UpdateUserCard {..._props} type={'edit'} />}
  //     />
  //     <Route path={`${match.path}`} component={Users} />
  //   </Switch>
  // );
  return <Users match={match} history={history} {...props} />;
};
