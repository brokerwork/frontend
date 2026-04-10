import cs from './style.less';
import { Icon } from 'lean-ui';

export default class NoticeBar extends Component {
  state = {
    show: true
  };
  onClose = () => {
    this.setState({
      show: false
    });
  };
  render() {
    const { children } = this.props;
    const { show } = this.state;
    if (!show) {
      return null;
    }
    return (
      <div className={cs['notice-bar']}>
        <div className={cs['wrapper']}>
          <div className={cs['content']}>
            {children}
            <Icon icon="close" onClick={this.onClose} />
          </div>
        </div>
      </div>
    );
  }
}
