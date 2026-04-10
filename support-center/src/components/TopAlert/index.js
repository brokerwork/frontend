import Alert from 'components/Alert';
import cs from './TopAlert.less';


const animateTime = 400;

export default class TopAlert extends PureComponent {
  state = {
    show: false
  }

  componentDidMount() {
    const { closeTime = 3000, onClose } = this.props;

    setTimeout(() => {
      this.setState({
        show: true
      });
    }, 1);
    setTimeout(() => {
      this.setState({
        show: false
      });
    }, closeTime);
    setTimeout(() => {
      onClose();
    }, closeTime + animateTime);
  }

  close = () => {
    const { onClose } = this.props;
    
    this.setState({
      show: false
    });
    setTimeout(() => {
      onClose();
    }, animateTime);
  }

  render() {
    const {
      style = 'danger',
      content,
      className = ''
    } = this.props;
    const { show } = this.state;

    return (
      <div className={`${cs['container']} ${className} ${show ? cs['show'] : ''}`}>
        <Alert style={style} className={cs[`alert-${style}`]}>
          <div className={cs['content']}>
            {content}
          </div>
          <span className="fa fa-times close" onClick={this.close}></span>
        </Alert>
      </div>
    );
  }
}

