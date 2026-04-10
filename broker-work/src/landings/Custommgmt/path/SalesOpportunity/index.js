import { Switch, Route } from 'react-router-dom';

import Root from './containers/SalesOpportunityRoot';
import SalesOpportunityDetails from './containers/OpportunityDetail';
import { CardPanelWrapper } from 'components/CardPanel';

export default class Sales extends Component {
  render() {
    const props = this.props;
    return (
      <Switch>
        <Route
          path={`${props.match.url}/:id`}
          component={SalesOpportunityDetails}
        />
        <Route path={props.match.url} component={Root} />
      </Switch>
    );
  }
}
