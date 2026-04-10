import { Route, Switch } from "react-router-dom";
import Async from "react-code-splitting";

const AppropriatenessTest = props => (
  <Async load={import("./path/AppropriatenessTest")} componentProps={props} />
);

export default () => (
  <Switch>
    <Route
      path="/preview/appropriatenessTest"
      component={AppropriatenessTest}
    />
  </Switch>
);
