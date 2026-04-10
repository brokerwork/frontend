import { Route, Switch } from "react-router-dom";
import PageWrapper from "components/PageWrapper";
import Auth from "./Auth";
import Home from "./Home";
import Preview from "./Preview";

export default () => (
  <PageWrapper>
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/preview" component={Preview} />
      <Route path="/" component={Auth} />
    </Switch>
  </PageWrapper>
);
