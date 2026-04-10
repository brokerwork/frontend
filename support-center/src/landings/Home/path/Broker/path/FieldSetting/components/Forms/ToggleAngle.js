export default class ToggleAngle extends PureComponent {
  render() {
    return this.props.show ? (
      <i className="fa fa-angle-up" />
    ) : (
      <i className="fa fa-angle-down" />
    );
  }
}
