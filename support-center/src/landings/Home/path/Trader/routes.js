import { Route, Switch } from 'react-router-dom';
import Async from 'react-code-splitting';

const BrandSetting = props => <Async load={import('./path/BrandSetting')} componentProps={props} />;
const EmailSetting = props => <Async load={import('./path/EmailSetting')} componentProps={props} />;
const DownloadCenter = props => <Async load={import('./path/DownloadCenter')} componentProps={props} />;
const ProductDetail = props => <Async load={import('./path/ProductDetail')} componentProps={props} />;
const AccessSetting = props => <Async load={import('./path/AccessSetting')} componentProps={props} />;
const Mt4Setting = props => <Async load={import('./path/Mt4Setting')} componentProps={props} />;
const Mt5Setting = props => <Async load={import('./path/Mt5Setting')} componentProps={props} />;
const CtraderSetting = props => <Async load={import('./path/CtraderSetting')} componentProps={props} />;
const CustomPlatform = props => <Async load={import('./path/CustomPlatform')} componentProps={props} />;
const CustomSetting = props => <Async load={import('./path/CustomSetting')} componentProps={props} />;
const AccountSetting = props => <Async load={import('./path/AccountSetting')} componentProps={props} />;
const FormSetting = props => <Async load={import('./path/FormSetting')} componentProps={props} />;
const AccountManage = props => <Async load={import('./path/AccountManage')} componentProps={props} />;

export default () => (
  <Switch>
    <Route path="/home/trader/brandSetting" component={BrandSetting} />
    <Route path="/home/trader/emailSetting" component={EmailSetting} />
    <Route path="/home/trader/downloadCenter" component={DownloadCenter} />
    <Route path="/home/trader/productDetail" component={ProductDetail} />
    <Route path="/home/trader/accessSetting" component={AccessSetting} />
    <Route path="/home/trader/mt4Setting" component={Mt4Setting} />
    <Route path="/home/trader/mt5Setting" component={Mt5Setting} />
    <Route path="/home/trader/ctraderSetting" component={CtraderSetting} />
    <Route path="/home/trader/customPlatform" component={CustomPlatform} />
    <Route path="/home/trader/accountSetting" component={AccountSetting} />
    <Route path="/home/trader/formSetting" component={FormSetting} />
    <Route path="/home/trader/customSetting/:plat" component={CustomSetting} />
    <Route path="/home/trader/accountManage" component={AccountManage} />
  </Switch>
);
