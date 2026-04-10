export default class CardPanel extends PureComponent {
  onClose = () => {
    const { onClose } = this.props;

    if (onClose) {
      onClose();
    }
  }

  render() {
    const { children, className = '' } = this.props;

    return (
      <div className={`card-panel-container ${className}`}>
        <div className="card-panel">
          {React.Children.map(children, (child) => React.cloneElement(child, {
            onClose: this.onClose
          }))}
        </div>
        <div className="card-panel-mark" onClick={this.onClose}></div>
      </div>
    );
  }
}

class Header extends PureComponent {
  render() {
    const { children, className = '', onClose } = this.props;

    return (
      <div className={`card-panel-header ${className}`}>
        <div className="card-panel-title">
          {children}
        </div>
        <a className="fa fa-times close" onClick={onClose}></a>
      </div>
    );
  }
}

class Body extends PureComponent {
  render() {
    const { children, className = '' } = this.props;

    return (
      <div className={`card-panel-body ${className}`}>
        {children}
      </div>
    );
  }
}

class Footer extends PureComponent {
  render() {
    const { children, className = '' } = this.props;

    return (
      <div className={`card-panel-footer ${className}`}>
        {children}
      </div>
    );
  }
}

CardPanel.Header = Header;
CardPanel.Body = Body;
CardPanel.Footer = Footer;