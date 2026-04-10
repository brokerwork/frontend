export default class Root extends PureComponent {
  render() {
    const { children } = this.props;

    return <div>{children}</div>;
  }
}
