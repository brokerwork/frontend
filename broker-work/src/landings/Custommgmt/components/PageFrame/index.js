import cs from './PageFrame.less';

class PageFrame extends PureComponent {
  render() {
    const { children, className, focusStyle } = this.props;
    const focus = ['left', 'right'].includes(focusStyle) ? focusStyle : 'right';
    const focusClass = cs[`panel-${focus}`];
    return (
      <div className={cs['root']}>
        <div
          className={`${cs['panel']} ${className
            ? className
            : ''} ${focusClass}`}
        >
          {children}
        </div>
      </div>
    );
  }
}

PageFrame.Header = ({ children, className }) => {
  return (
    <div className={`${cs['header']} ${className ? className : ''}`}>
      {children}
    </div>
  );
};

PageFrame.Body = ({ children, className }) => {
  return (
    <div className={`${cs['body']} ${className ? className : ''}`}>
      {children}
    </div>
  );
};

PageFrame.Left = ({ children, className }) => {
  return (
    <div className={`${cs['left']} ${className ? className : ''}`}>
      {children}
    </div>
  );
};

PageFrame.Right = ({ children, className }) => {
  return (
    <div className={`${cs['right']} ${className ? className : ''}`}>
      {children}
    </div>
  );
};

export default PageFrame;
