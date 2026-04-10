import * as React from "react";
import * as cs from "./app.less";
import { observer, inject } from "mobx-react";
import ls, { TOKEN } from "@/utils/storage";
import { history } from "@/index";

@inject("commonStore")
@observer
class App extends React.Component {
  constructor(p) {
    super(p);
    p.commonStore.fetchUserRights();
  }
  componentDidMount() {
    const token = ls.get(TOKEN);
    if (!token) {
      push("/login");
    }
  }
  render() {
    return <div className={cs.container}>{this.props.children}</div>;
  }
}
export default App;
