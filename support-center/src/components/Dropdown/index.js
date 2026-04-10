import { findDOMNode } from 'react-dom';

export default class Dropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isOpen
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      isOpen: props.isOpen
    });
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  handleDocumentClick = evt => {
    if (!findDOMNode(this).contains(evt.target)) {
      this.setState({
        isOpen: false
      });
      this.notifyHiddenMenu();
    }
  };

  notifyHiddenMenu = () => {
    const { onHiddenMenu } = this.props;
    if (onHiddenMenu) {
      onHiddenMenu();
    }
  };

  onToggle = () => {
    const { disabled } = this.props;

    if (disabled) return;
    if (this.state.isOpen) {
      this.notifyHiddenMenu();
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  onMenuClick = () => {
    this.setState({
      isOpen: false
    });
    this.notifyHiddenMenu();
  };

  render() {
    const { isOpen } = this.state;
    const { children, className = '', right } = this.props;

    return (
      <div className={`dropdown ${className} ${right ? 'dropdown-menu-right' : ''} ${isOpen ? 'open' : ''}`}>
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            isOpen,
            onToggle: this.onToggle,
            onMenuClick: this.onMenuClick
          })
        )}
      </div>
    );
  }
}

class Toggle extends PureComponent {
  render() {
    const { children, className = '', onToggle } = this.props;

    return (
      <div className={`dropdown-toggle ${className}`} onClick={onToggle}>
        {children}
      </div>
    );
  }
}

class Menu extends PureComponent {
  render() {
    const { children, className = '', onMenuClick, isOpen } = this.props;

    if (!isOpen) return null;

    return (
      <div className={`dropdown-menu ${className}`} onClick={onMenuClick}>
        {children}
      </div>
    );
  }
}

Dropdown.Toggle = Toggle;
Dropdown.Menu = Menu;
