import { Route, Switch } from 'react-router-dom';
import Async from 'react-code-splitting';

const EmailSetting = props => <Async load={import('./path/EmailSetting')} componentProps={props} />;

const FieldSetting = props => <Async load={import('./path/FieldSetting')} componentProps={props} />;

const BrandSetting = props => <Async load={import('./path/BrandSetting')} componentProps={props} />;

const ConnectorSetting = props => <Async load={import('./path/ConnectorSetting')} componentProps={props} />;

const ProductDetail = props => <Async load={import('./path/ProductDetail')} componentProps={props} />;
const AccessSetting = props => <Async load={import('./path/AccessSetting')} componentProps={props} />;

export default () => (
  <Switch>
    <Route path="/home/broker/emailSetting" component={EmailSetting} />
    <Route path="/home/broker/fieldSetting" component={FieldSetting} />
    <Route path="/home/broker/brandSetting" component={BrandSetting} />
    <Route path="/home/broker/connectorSetting" component={ConnectorSetting} />
    <Route path="/home/broker/productDetail" component={ProductDetail} />
    <Route path="/home/broker/accessSetting" component={AccessSetting} />
  </Switch>
);
