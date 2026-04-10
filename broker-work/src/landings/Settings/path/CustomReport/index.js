import { Switch, Route, Redirect } from 'react-router-dom';
import List from './path/List';

export default class CustomReport extends Component {
  render() {
    const props = this.props;
    return (
      <Switch>
        <Route path={`${props.match.path}/`} component={List} />
      </Switch>
    );
  }
}
