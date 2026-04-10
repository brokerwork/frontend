// 一个文本显示组件， 文本将以text-over: ellipsis的方式显示,如果overflow了,可通过点击弹框显示全文
import cs from './index.less';
export default class EllipsisContent extends PureComponent {
  state = {
    overflow: false
  };
  reCheckLayout = () => {
    const container = this.refs.container;
    const content = this.refs.content;
    if (content.offsetWidth > container.offsetWidth) {
      this.setState({
        overflow: true
      });
    }
  };
  onClick = e => {
    const { showTipsModal, children } = this.props;
    const { overflow } = this.state;
    if (overflow) {
      showTipsModal({
        content: children,
        noCancel: true
      });
    }
  };
  render() {
    const { children, className } = this.props;
    const { overflow } = this.state;
    const overFlowClass = overflow ? cs['over-flow'] : '';
    return (
      <span
        ref="container"
        className={`${cs['container']} ${className} ${overFlowClass}`}
        onClick={this.onClick}
        onMouseEnter={this.reCheckLayout}
      >
        <span ref="content">{children}</span>
      </span>
    );
  }
}
