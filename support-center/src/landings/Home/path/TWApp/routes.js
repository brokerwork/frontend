import { Route, Switch } from "react-router-dom";
import Async from "react-code-splitting";

const ProductDetail = props => (
  <Async load={import("./path/ProductDetail")} componentProps={props} />
);
const TraderVendor = props => (
  <Async load={import("./path/TraderVendor")} componentProps={props} />
);

const BrandSettings = props => (
  <Async load={import("./path/BrandSetting")} componentProps={props} />
);
const VarietySetting = props => (
  <Async load={import("./path/VarietySetting")} componentProps={props} />
);

const TradeTimeSetting = props => (
  <Async load={import("./path/TradeTimeSetting")} componentProps={props} />
);

const DayOffSetting = props => (
  <Async load={import("./path/DayOffSetting")} componentProps={props} />
);
const CustomerServiceContact = props => (
  <Async
    load={import("./path/CustomerServiceContact")}
    componentProps={props}
  />
);

const QuatationInterval = props => (
  <Async load={import("./path/QuotationInterval")} componentProps={props} />
);

const MonthlyFlowReport = props => (
  <Async load={import("./path/MonthlyFlowReport")} componentProps={props} />
);

const FollowOrder = props => (
  <Async load={import("./path/FollowOrder")} componentProps={props} />
);

export default () => (
  <Switch>
    <Route path="/home/twapp/brandSetting" component={BrandSettings} />
    <Route path="/home/twapp/productDetail" component={ProductDetail} />
    <Route path="/home/twapp/dayOffSetting" component={DayOffSetting} />
    <Route
      path="/home/twapp/customeServiceContactSetting"
      component={CustomerServiceContact}
    />
    <Route path="/home/twapp/varietySetting" component={VarietySetting} />
    <Route path="/home/twapp/vendorSetting" component={TraderVendor} />
    <Route path="/home/twapp/tradeTimeSetting" component={TradeTimeSetting} />
    <Route path="/home/twapp/quotationInterval" component={QuatationInterval} />
    <Route path="/home/twapp/monthlyFlowReport" component={MonthlyFlowReport} />
    <Route path="/home/twapp/followOrder" component={FollowOrder} />
  </Switch>
);
