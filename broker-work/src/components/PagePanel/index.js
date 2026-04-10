import cs from './PagePanel.less';

class PagePanel extends PureComponent {
  render() {
    const { children, className } = this.props;
    return (
      <div className={`${cs['panel']} ${className ? className : ''}`}>
        {children}
      </div>
    );
  }
}

PagePanel.Header = ({ children, className }) => {
  return (
    <div className={`${cs['header']} ${className ? className : ''}`}>
      {children}
    </div>
  );
};

PagePanel.Body = ({ children, className }) => {
  return (
    <div className={`${cs['body']} ${className ? className : ''}`}>
      {children}
    </div>
  );
};

export default PagePanel;
