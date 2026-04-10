import { Route, Switch } from 'react-router-dom';

import InBox from './InBox';
import SendSuccess from './SendSuccess';
import OutBox from './OutBox';
import DraftBox from './DraftBox';
import RecycleBin from './RecycleBin';
import AddMessage from './AddMessage';
import { CardPanelWrapper } from 'components/CardPanel';
import DetailsModal from '../components/DetailsModal';
import { Layout } from 'components/v2/PageWraper';

class Routes extends Component {
  render() {
    const { match } = this.props;
    return (
      <Layout footer>
        <Route
          path={`${match.url}/:sourceBox/details/:id`}
          children={createProps => (
            <CardPanelWrapper appear>
              {createProps.match && (
                <DetailsModal
                  {...createProps}
                  // backToRoot={this.backToRoot}
                />
              )}
            </CardPanelWrapper>
          )}
        />
        <Switch>
          <Route path={`${match.url}/inbox`} component={InBox} />
          <Route path={`${match.url}/outbox`} component={OutBox} />
          <Route path={`${match.url}/draftbox`} component={DraftBox} />
          <Route path={`${match.url}/recyclebin`} component={RecycleBin} />
          <Route path={`${match.url}/addMessage`} component={AddMessage} />
          <Route
            path={`${match.url}/sendSuccess/:id`}
            component={SendSuccess}
          />
          <Route path={match.url} exact component={InBox} />
        </Switch>
      </Layout>
    );
  }
}

export default Routes;
