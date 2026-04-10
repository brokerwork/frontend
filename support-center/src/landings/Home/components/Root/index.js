import ContainerWrapper from "components/ContainerWrapper";

export default class Root extends PureComponent {
  componentDidMount(){
    const {getSystemLanguages} = this.props;
    getSystemLanguages()
  }
  render() {
    return <ContainerWrapper {...this.props} />;
  }
}
