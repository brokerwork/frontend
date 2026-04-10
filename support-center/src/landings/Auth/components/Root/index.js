export default class Root extends PureComponent {
  componentDidMount(){
    const {getSystemLanguages} = this.props;
    getSystemLanguages();
  }
  render() {
    const { children } = this.props;

    return <div>{children}</div>;
  }
}
