import { Router, Route, IndexRedirect } from 'react-router';

import Root from './containers/Root';
import InBox from './path/InBox';
import SendSuccess from './path/SendSuccess';
import OutBox from './path/OutBox';
import DraftBox from './path/DraftBox';
import RecycleBin from './path/RecycleBin';
import AddMessage from './path/AddMessage';
import Details from './path/Details';

class Routes extends Component {
  render() {
    const { history } = this.props;
    return (
      <Router history={history}>
        <Route path="/" component={Root}>
          <Route path="inbox" component={InBox} />
          <Route path="outbox" component={OutBox} />
          <Route path="draftbox" component={DraftBox} />
          <Route path="recyclebin" component={RecycleBin} />
          <Route path="addMessage" component={AddMessage} />
          <Route path="sendSuccess/:id" component={SendSuccess} />
          <Route path="details/:id" component={Details} />
          <IndexRedirect to="inbox" />
        </Route>
      </Router>
    );
  }
}

export default Routes;
