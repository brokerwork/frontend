import { Route, Switch } from "react-router-dom";
import ProductDetail from "./path/ProductDetail";

export default () => (
  <Switch>
    <Route path="/Bridge/v2.0/productDetail" component={ProductDetail} />
  </Switch>
);
