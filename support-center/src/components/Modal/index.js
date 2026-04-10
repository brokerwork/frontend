export default class Modal extends PureComponent {
  render() {
    const { children, className = '', onClose, size } = this.props;

    return (
      <div className={`modal-container ${className}`}>
        <div className={`modal-dialog ${size ? `modal-${size}` : ''}`}>
          {React.Children.map(children, child =>
            React.cloneElement(child, {
              onClose
            })
          )}
        </div>
      </div>
    );
  }
}

class Header extends PureComponent {
  render() {
    const { children, className = '', onClose } = this.props;

    return (
      <div className={`modal-header ${className}`}>
        <div className="modal-title">{children}</div>
        <a className="fa fa-times close" onClick={onClose}></a>
      </div>
    );
  }
}

class Body extends PureComponent {
  render() {
    const { children, className = '', scrolling = true, style } = this.props;

    return (
      <div style={style} className={`modal-body ${scrolling ? 'scrolling' : ''} ${className}`}>
        {children}
      </div>
    );
  }
}

class Footer extends PureComponent {
  render() {
    const { children, className = '' } = this.props;

    return <div className={`modal-footer ${className}`}>{children}</div>;
  }
}

Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
