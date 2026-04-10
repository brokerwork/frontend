export default class Panel extends PureComponent {
  render() {
    const { className = '', children, header } = this.props;

    return (
      <div className={`panel ${className}`}>
        <div className="panel-header">
          {header}
        </div>
        <div className="panel-body">
          {children}
        </div>
      </div>
    );
  }
}