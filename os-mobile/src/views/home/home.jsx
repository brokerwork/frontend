import * as React from "react";
import * as cs from "./home.less";
import { Button } from "antd-mobile";
class Home extends React.Component {
  state = {};
  componentDidMount() {}

  render() {
    return (
      <div className={cs.home}>
        helloworld
        <Button>click</Button>
      </div>
    );
  }
}
export default Home;
