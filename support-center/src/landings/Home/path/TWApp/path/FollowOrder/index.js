import { Route, Switch } from "react-router-dom";
import Root from "./containers/Root";
import { injectReducer } from "utils/injectReducer";
import * as reducers from "./controls/reducers";
import SymbolSetting from "./path/SymbolSetting";
import ConnectorSetting from "./path/ConnectorSetting";

injectReducer("twappFollowOrder", reducers);

export default props => {
  return (
    <Root {...props}>
      <Switch>
        <Route
          path="/home/twapp/followOrder/symbolSetting"
          component={SymbolSetting}
        />
        <Route
          path="/home/twapp/followOrder/connectorSetting"
          component={ConnectorSetting}
        />
      </Switch>
    </Root>
  );
};
