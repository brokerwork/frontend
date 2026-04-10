import React from "react";
import { observer } from "mobx-react";
import cs from "./index.less";

const App = observer(props => {
  // Declare a new state variable, which we'll call "count"
  return <div className={cs.app_container}>{props.children}</div>;
});

export default App;
