import { Switch, Route, Redirect } from 'react-router-dom';

import TaskLogs from './path/Task';
import AccountLogs from './path/Account';
import BasicLogs from './path/Basic';
import CustomerLogs from './path/Customer';
import MessageLogs from './path/Message';
import SystemLogs from './path/System';
import UserLogs from './path/User';
import TWUserLogs from './path/TWUser';
import ReportLogs from './path/Report';

export default class Message extends Component {
  render() {
    const props = this.props;
    return (
      <Switch>
        <Route path={`${props.match.path}/task`} component={TaskLogs} />
        <Route path={`${props.match.path}/account`} component={AccountLogs} />
        <Route path={`${props.match.path}/basic`} component={BasicLogs} />
        <Route path={`${props.match.path}/customer`} component={CustomerLogs} />
        <Route path={`${props.match.path}/message`} component={MessageLogs} />
        <Route path={`${props.match.path}/system`} component={SystemLogs} />
        <Route path={`${props.match.path}/user`} component={UserLogs} />
        <Route path={`${props.match.path}/twuser`} component={TWUserLogs} />
        <Route path={`${props.match.path}/report`} component={ReportLogs} />
      </Switch>
    );
  }
}
