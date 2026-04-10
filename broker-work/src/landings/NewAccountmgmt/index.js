import { Route, Switch } from 'react-router-dom';
import Root from './containers/Root';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';
import List from './path/List';
import Detail from './path/Detail';

injectReducer('accountManagement', reducers);

export default props => {
  return (
    <Root {...props}>
      <Switch>
        <Route path="/accountmgmt/:id" component={Detail} />
        <Route path="/accountmgmt" component={List} />
      </Switch>
    </Root>
  );
};
