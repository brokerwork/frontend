import { Route, Switch } from "react-router-dom";
import PageWrapper from "components/PageWrapper";
import v2_1 from "./v2.1";
import v2_0 from "./v2.0";

export default () => (
  <PageWrapper>
    <Switch>
      <Route path="/Bridge/v2.0" component={v2_0} />
      <Route path="/Bridge/v2.1" component={v2_1} />
    </Switch>
  </PageWrapper>
);
