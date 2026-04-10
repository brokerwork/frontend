// content
// title
// trigger
import cs from './style.less';
export default class Popover extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.popOverShow.bind(this);
  }
  popOverShow(type) {
    const { trigger } = this.props;
    if (trigger === type) {
      this.setState({
        show: true
      });
      return;
    }
  }
  onMouseOut() {
    const { trigger } = this.props;
    if (trigger === 'hover') {
      this.setState({
        show: false
      });
    }
  }
  render() {
    const {
      content,
      trigger,
      children,
      className = '',
      inline,
      align = 'top',
      popoverClassName = ''
    } = this.props;
    const { show } = this.state;
    return (
      <div
        className={`${inline && cs['inline']} ${cs['container']} ${className}`}
        onClick={this.popOverShow.bind(this, 'click')}
        onMouseOver={this.popOverShow.bind(this, 'hover')}
        onMouseOut={this.onMouseOut.bind(this)}
      >
        {show && (
          <div
            className={`popover ${align} ${show &&
              cs['show']} ${popoverClassName}`}
          >
            <div className="arrow" />
            <div className="popover-content">{content}</div>
          </div>
        )}
        {children}
      </div>
    );
  }
}
