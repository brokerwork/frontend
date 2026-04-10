import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import cls from 'utils/class';
import cs from './Modal.less';

export default class Modal extends PureComponent {
  render() {
    const {
      className = '',
      children,
      show = true,
      bsSize,
      onHide = fn
    } = this.props;
    const bsSizeMap = {
      small: 'modal-sm',
      sm: 'modal-sm',
      large: 'modal-lg',
      lg: 'modal-lg'
    };
    const sizeClassName = bsSizeMap[bsSize] || '';

    let child;
    if (children && Array.isArray(children)) {
      child = children.map((item, index) => {
        return item
          ? React.cloneElement(item, { onHide, key: index })
          : undefined;
      });
    } else if (children && typeof children === 'object') {
      child = React.cloneElement(children, { onHide });
    }
    return (
      <div
        style={{ display: show ? 'block' : 'none' }}
        className={cls`modal ${cs['container']} ${className}`}
      >
        <div className={`modal-dialog ${cs['modal']} ${sizeClassName}`}>
          <div className="modal-content">{child}</div>
        </div>
      </div>
    );
  }
}

Modal.Animate = ({ children }) => (
  <CSSTransitionGroup
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    transitionName="modal-animate"
  >
    {children}
  </CSSTransitionGroup>
);

Modal.Header = ({ children, className = '', closeButton, onHide }) => (
  <div className={`${className} modal-header`}>
    {closeButton ? (
      <button type="button" onClick={onHide} className="close" />
    ) : (
      undefined
    )}
    {children}
  </div>
);

Modal.Title = ({ children, className = '' }) => (
  <h4 className={`${className} modal-title`}>{children}</h4>
);

Modal.Body = ({ children, className = '' }) => (
  <div className={`${className} modal-body`}>{children}</div>
);

Modal.Footer = ({ children, className = '' }) => (
  <div className={`${className} modal-footer`}>{children}</div>
);

function fn() {
  console.log('fn function');
}
