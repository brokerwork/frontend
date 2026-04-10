import Nav from 'components/Nav';

export default class Tab extends PureComponent {
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
    const { onChange } = this.props;

    if (activeKey !== this.state.activeKey) {
      this.setState({
        activeKey
      });
      if (onChange) {
        onChange(activeKey);
      }
    }
  };

  _renderNavs = () => {
    const { activeKey } = this.state;
    const { children } = this.props;
    const navs = []
      .concat(children)
      .filter(el => !!el)
      .map((child, idx) => ({
        label: child.props.title,
        eventKey: child.props.eventKey
      }));

    return (
      <Nav activeKey={activeKey} onChange={this.onToggle}>
        {navs.map((nav, idx) => {
          return (
            <Nav.Item eventKey={nav.eventKey} key={idx}>
              {nav.label}
            </Nav.Item>
          );
        })}
      </Nav>
    );
  };

  render() {
    const { activeKey } = this.state;
    const { children, className = '' } = this.props;

    return (
      <div className={`tab ${className}`}>
        {this._renderNavs()}
        {React.Children.map(children, child =>
          child
            ? React.cloneElement(child, {
                activeKey
              })
            : undefined
        )}
      </div>
    );
  }
}

class Panel extends PureComponent {
  render() {
    const { children, eventKey, activeKey, className = '', key } = this.props;
    const isActive = eventKey === activeKey;

    return (
      <div key={key} className={`tab-content ${isActive ? 'active' : ''} ${className}`}>
        {children}
      </div>
    );
  }
}

Tab.Panel = Panel;
