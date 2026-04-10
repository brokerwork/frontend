import Root from './container/Root';

import { Switch, Route, Redirect } from 'react-router-dom';

export default class Message extends Component {
  render() {
    const props = this.props;
    return (
      <Switch>
        <Route path={`${props.match.path}/template/:type`} component={Root} />
        <Redirect
          from={props.match.path}
          to={`${props.match.path}/template/mail`}
        />
      </Switch>
    );
  }
}
