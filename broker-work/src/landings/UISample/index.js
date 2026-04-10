import { Route, Switch } from 'react-router-dom';
import List from './List';
import Detail from './Detail';

export default class Index extends Component {
  render() {
    const props = this.props;
    return (
      <Switch>
        <Route path={`${props.match.url}/detail`} component={Detail} />
        <Route path={`${props.match.url}/`} component={List} />
      </Switch>
    );
  }
}
