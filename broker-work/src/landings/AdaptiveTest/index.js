import Root from './containers/Root';
import { injectReducer } from 'utils/injectReducer';
import { Switch, Route } from 'react-router-dom';
import * as reducers from './controls/reducers';

injectReducer('adaptiveTest', reducers);

injectReducer('usersetting', reducers);

export default ({ history, ...props }) => {
  return (
    <Switch>
      <Route path={`${props.match.url}/:id?/:idType?`} component={Root} />
    </Switch>
  );
};
