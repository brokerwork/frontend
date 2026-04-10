export default class Alert extends PureComponent {
  render() {
    const { style, children, className = '' } = this.props;

    return (
      <div className={`alert alert-${style} ${className}`}>
        {children}
      </div>
    );
  }
}