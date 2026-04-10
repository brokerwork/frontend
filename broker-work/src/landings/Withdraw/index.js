import { Route, Switch } from 'react-router-dom';
import Root from './containers/Root';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';

injectReducer('withDraw', reducers);

export default ({ history, ...props }) => {
  return (
    <Switch>
      <Route path="/" component={Root} />
    </Switch>
  );
};
