import { Switch, Route, Redirect } from 'react-router-dom';
import Root from '../../containers/Root';
import Account from './path/Account';
import Customer from './path/Customer';
import Report from './path/Report';

export default class SearchCondition extends Component {
  render() {
    const props = this.props;
    return (
      <Switch>
        <Route path={`${props.match.path}/account`} component={Account} />
        <Route path={`${props.match.path}/customer`} component={Customer} />
        <Route path={`${props.match.path}/report`} component={Report} />
        <Redirect from={props.match.url} to={`${props.match.path}/account`} />
      </Switch>
    );
  }
}
