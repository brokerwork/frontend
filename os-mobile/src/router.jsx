import { Route, Switch, Redirect } from 'react-router-dom';
import * as React from 'react';
import { withRouter } from 'react-router';
import Home from './views/home/home';
import List from './views/list/list';
import Login from './views/login/login';
import Product from './views/product/product';
import Increment from './views/increment/increment';
import App from './views/app/app';
import ls, { TOKEN } from '@/utils/storage.js';

import AccountList from './views/AccountList';
import Renew from './views/Renew';
import { observer } from 'mobx-react';
@observer
class Routes extends React.Component {
  render() {
    const { props } = this;
    return !!ls.get(TOKEN) ? (
      <App>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/list" component={List} />
          <Route path="/product" component={Product} />
          <Route path="/increment" component={Increment} />
          <Route path="/accountList" component={AccountList} />
          <Route path="/renew" component={Renew} />
          <Redirect
            to={{
              pathname: '/accountList',
              search: props.history.location.search
            }}
          />
        </Switch>
      </App>
    ) : (
      <Switch>
        <Route path="/login" component={Login} />
        <Redirect
          to={{
            pathname: '/login'
          }}
        />
      </Switch>
    );
  }
}
export default withRouter(Routes);
