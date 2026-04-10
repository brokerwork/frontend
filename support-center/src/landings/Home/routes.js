import { Route, Switch } from 'react-router-dom';
import Async from 'react-code-splitting';

const Dashboard = props => <Async load={import('./path/Dashboard')} componentProps={props} />;

const Consumption = props => <Async load={import('./path/Consumption')} componentProps={props} />;

const Broker = props => <Async load={import('./path/Broker')} componentProps={props} />;

const Trader = props => <Async load={import('./path/Trader')} componentProps={props} />;

const TWApp = props => <Async load={import('./path/TWApp')} componentProps={props} />;

const Dealer = props => <Async load={import('./path/Dealer')} componentProps={props} />;

const NoMatch = props => <Async load={import('./path/Iframe')} componentProps={props} />;

export default () => (
  <Switch>
    <Route path="/home/dashboard" component={Dashboard} />
    <Route path="/home/consumption" component={Consumption} />
    {/* <Route path="/home/broker/emailSetting" component={Broker} />
    <Route path="/home/broker/fieldSetting" component={Broker} />
    <Route path="/home/broker/brandSetting" component={Broker} />
    <Route path="/home/broker/connectorSetting" component={Broker} />
    <Route path="/home/broker/productDetail" component={Broker} />
    <Route path="/home/broker/accessSetting" component={Broker} /> */}
    <Route path="/home/broker" component={Broker} />
    <Route path="/home/feed" component={NoMatch} />
    {/* <Route path="/home/trader/brandSetting" component={Trader} />
    <Route path="/home/trader/emailSetting" component={Trader} />
    <Route path="/home/trader/downloadCenter" component={Trader} />
    <Route path="/home/trader/productDetail" component={Trader} />
    <Route path="/home/trader/accessSetting" component={Trader} /> */}
    <Route path="/home/trader" component={Trader} />
    <Route path="/home/bridge" component={NoMatch} />
    <Route path="/home/twapp" component={TWApp} />
    <Route path="/home/dealer" component={Dealer} />
  </Switch>
);
