export default class Accordion extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: props.activeKey
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      activeKey: props.activeKey
    });
  }

  onToggle = activeKey => {
    this.setState({
      activeKey: activeKey === this.state.activeKey ? "" : activeKey
    });
  };

  render() {
    const { activeKey } = this.state;
    const { children } = this.props;

    return (
      <div className="accordion">
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            activeKey,
            onToggle: this.onToggle
          })
        )}
      </div>
    );
  }
}

class Panel extends PureComponent {
  onClick = () => {
    const { onToggle, activeKey, eventKey } = this.props;

    if (onToggle) {
      onToggle(eventKey);
    }
  };

  render() {
    const {
      header,
      children,
      className = "",
      activeKey,
      eventKey
    } = this.props;
    const isActive = activeKey === eventKey;

    return (
      <div
        className={`accordion-panel ${className} ${isActive ? "active" : ""}`}
      >
        <div className="accordion-panel-header" onClick={this.onClick}>
          {header}
        </div>
        <div className="accordion-panel-content">{children}</div>
      </div>
    );
  }
}

Accordion.Panel = Panel;
