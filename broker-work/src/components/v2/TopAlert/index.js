import { Message } from 'lean-ui';
import { IntlProvider } from 'react-intl';
Message.config({
  top: 64
});

function fn() {}
const animateTime = 400;

class AlertContent extends PureComponent {
  render() {
    const { children } = this.props;
    return <IntlProvider locale="en"><span>{children}</span></IntlProvider> //兼容i18n的内容
  }
}
export default class TopAlert extends PureComponent {
  componentDidMount() {
    this.showAlert(this.props);
  }
  showAlert = props => {
    const { bsStyle = 'danger', content, className = '', onClose = fn } = props;
    const bsStyleFuncMap = {
      danger: 'error',
      warning: 'warning',
      success: 'success',
      info: 'info'
    };
    const funcName = bsStyleFuncMap[bsStyle] || 'error';
    Message[funcName](<AlertContent>{content}</AlertContent>, this.close);
  };
  componentWillReceiveProps(nextProps) {
    const { content } = this.props;
    const { content: nextContent } = nextProps;
    if (content != nextContent) {
      this.showAlert(nextProps);
    }
  }

  close = () => {
    const { onClose = fn } = this.props;
    onClose();
  };
  render() {
    return false;
  }
}
