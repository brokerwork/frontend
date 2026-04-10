import ContentWrapper from "components/ContentWrapper";
import cs from "./Root.less";

export default class Root extends PureComponent {
  render() {
    const { children } = this.props;

    return <div className={cs["container"]}>{children}</div>;
  }
}
