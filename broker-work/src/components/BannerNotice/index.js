import { Alert } from 'react-bootstrap';
import cls from 'utils/class';
import cs from './BannerNotice.less';

function fn() {}
const animateTime = 400;
export default class BannerNotice extends Component {
  state = {
    show: false
  };
  componentDidMount() {
    const {
      closeTime = 3000,
      onClose = fn,
      onHide = fn,
      autoClose
    } = this.props;
    this.setState({
      show: true
    });
    if (!autoClose) return;
    setTimeout(() => {
      this.setState({
        show: false
      });
    }, closeTime);
    onClose();
    onHide();
  }
  close = () => {
    const { onClose = fn, onHide = fn } = this.props;
    this.setState({
      show: false
    });
    onClose();
    onHide();
  };
  render() {
    const { bsStyle = 'success', content, className = '' } = this.props;
    const { show } = this.state;
    return (
      <div
        className={cls`${className}
                      ${cs['box']}                
                      ${show ? cs['show'] : ''}`}
      >
        <Alert bsStyle={bsStyle}>
          <div className={`${cs['content']}`}>{content}</div>
          <i onClick={this.close} className={`fa fa-times ${cs['icon']}`} />
        </Alert>
      </div>
    );
  }
}
