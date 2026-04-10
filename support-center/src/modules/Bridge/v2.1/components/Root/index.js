// export default class Root extends PureComponent {
//   render() {
//     const { children } = this.props;

//     return <div>{children}</div>;
//   }
// }
import ContainerWrapper from "components/ContainerWrapper";

export default class Root extends PureComponent {
  render() {
    return <ContainerWrapper {...this.props} />;
  }
}
