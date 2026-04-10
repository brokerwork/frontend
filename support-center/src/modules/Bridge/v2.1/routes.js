import { Route, Switch } from "react-router-dom";
import ProductDetail from "./path/ProductDetail";
import ConnectorSetting from "./path/ConnectorSetting";

export default () => (
  <Switch>
    <Route path="/Bridge/v2.1/productDetail" component={ProductDetail} />
    <Route path="/Bridge/v2.1/connectorSetting" component={ConnectorSetting} />
  </Switch>
);
