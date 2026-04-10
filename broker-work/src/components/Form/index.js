import cs from './Form.less';
import Tips from 'components/Tips';
export default class Form extends PureComponent {
  render() {
    const { children, className = '', size = 'normal' } = this.props;
    return (
      <div className={`${cs['container']} ${className} ${cs[size]}`}>
        {children}
      </div>
    );
  }
}

Form.Item = ({ children, col = 1, className = '' }) => (
  <div className={`item ${cs['item']} ${cs[`item-${col}`]} ${className}`}>
    {children}
  </div>
);

Form.Label = ({ children, title, className = '', required = false, tips }) => (
  <label className={`item-label ${cs['label']} ${className}`}>
    {required ? <span className="required" /> : undefined}
    <span className={cs['item-label-content']} title={title}>
      {children}
    </span>
    {tips ? (
      <Tips
        icon="fa fa-question-circle"
        className={`${cs['label-tips']} form-label-tips`}
      >
        <div
          className={`${cs['ques-content']} ${
            tips.length > 14 ? cs['long'] : ''
          }`}
        >
          {tips}
        </div>
      </Tips>
    ) : (
      undefined
    )}
  </label>
);

Form.Control = ({ children, error, className = '', checkbox = false }) => (
  <div
    className={`item-control ${cs['control']} ${className} ${
      checkbox ? cs['checkbox'] : ''
    }`}
  >
    {children}
    {error ? <div className={cs['errorMsg']}>{error}</div> : undefined}
  </div>
);
