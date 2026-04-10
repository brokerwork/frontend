import AccountSetting from './containers/Root';
import AccountGroup from './containers/AccountGroup';
import { Switch, Route } from 'react-router-dom';

export default class Account extends Component {
  render() {
    const props = this.props;
    return (
      <Switch>
        <Route
          path={`${props.match.path}/accountsetting`}
          component={AccountSetting}
        />
        <Route
          path={`${props.match.path}/accountgroup`}
          component={AccountGroup}
        />
      </Switch>
    );
  }
}
