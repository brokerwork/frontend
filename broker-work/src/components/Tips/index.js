import cs from './Tips.less';
import { findDOMNode } from 'react-dom';

export default class Tips extends Component {
  componentDidMount() {
    document.addEventListener('click', this.hideTips);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.hideTips);
  }
  hideTips = e => {
    if (findDOMNode(this).contains(e.target)) return;
    this.setState({
      show: false
    });
  };
  state = {
    show: false
  };
  toggleTips = s => {
    const { show } = this.state;
    this.setState({
      show: !show
    });
  };
  onTipsClick = evt => {
    evt.stopPropagation();
    const { onClick } = this.props;
    if (onClick) onClick();
    this.toggleTips();
  };
  render() {
    const {
      align = 'right',
      children,
      inline = true,
      className = '',
      icon = 'fa fa-question',
      text,
      hover = false,
      popoverClassName = ''
    } = this.props;
    const { show } = this.state;
    const handles = hover
      ? {
          onMouseEnter: this.toggleTips,
          onMouseLeave: this.toggleTips
        }
      : {
          onClick: this.onTipsClick
        };
    return (
      <div
        className={`${inline && cs['inline']} ${cs['container']} ${className}`}
        data-test={this.props['data-test']}
      >
        {text ? (
          <span {...handles}>{text}</span>
        ) : (
          <i className={`${icon} ${cs['icon']}`} {...handles} />
        )}
        {show && (
          <div
            className={`popover ${align} ${show &&
              cs['show']} ${popoverClassName}`}
          >
            <div className="arrow" />
            <div className="popover-content">{children}</div>
          </div>
        )}
      </div>
    );
  }
}
function fn() {}
