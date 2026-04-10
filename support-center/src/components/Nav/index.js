export default class Nav extends PureComponent {
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

  render() {
    const { activeKey } = this.state;
    const { children, className = '', sm = false } = this.props;
    const isArray = Array.isArray(children);
    const cloneChildren = (isArray ? children : [children]).filter(child => typeof child !== 'undefined');

    return (
      <ul className={`tab-nav ${sm ? 'tab-nav-sm' : ''} ${className}`}>
        {React.Children.map(cloneChildren, child =>
          child
            ? React.cloneElement(child, {
                activeKey,
                onToggle: this.onToggle
              })
            : null
        )}
      </ul>
    );
  }
}

class Item extends PureComponent {
  render() {
    const { children, eventKey, activeKey, onToggle } = this.props;
    const isActive = activeKey === eventKey;

    return (
      <li className={isActive ? 'active' : ''}>
        <a onClick={onToggle.bind(this, eventKey)}>{children}</a>
      </li>
    );
  }
}

class Buttons extends PureComponent {
  render() {
    const { children, className = '' } = this.props;

    return <li className={`tab-nav-buttons ${className}`}>{children}</li>;
  }
}

Nav.Item = Item;
Nav.Buttons = Buttons;
