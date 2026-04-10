import { Switch, Route, Redirect } from 'react-router-dom';
import Customers from './path/Customers';
// import Contacts from './path/Contacts';
import SalesOpportunity from './path/SalesOpportunity';
import * as reducers from './reducers';
import { injectReducer } from 'utils/injectReducer';
import BillEdit from './path/Bills/containers/Edit';

injectReducer('customMgmt', reducers);

export default class Custommgmt extends Component {
  render() {
    const props = this.props;
    return (
      <Switch>
        <Route path={`${props.match.url}/customers`} component={Customers} />
        {/* <Route
          path={`${props.match.url}/contactsroot/:contactId`}
          component={Contacts}
        /> */}
        {/* <Route path={`${props.match.url}/contactsroot`} component={Contacts} /> */}
        <Route
          path={`${props.match.url}/salesopportunities`}
          component={SalesOpportunity}
        />
        <Route
          path={'/exportBill/:customerId/:billId'}
          render={_props => <BillEdit {..._props} justForm={true} />}
        />
        <Redirect from={props.match.url} to={`${props.match.url}/customers`} />
      </Switch>
    );
  }
}
