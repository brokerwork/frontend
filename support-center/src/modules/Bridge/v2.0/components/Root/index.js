import ContainerWrapper from "components/ContainerWrapper";

export default class Root extends PureComponent {
  render() {
    return <ContainerWrapper {...this.props} />;
  }
}
