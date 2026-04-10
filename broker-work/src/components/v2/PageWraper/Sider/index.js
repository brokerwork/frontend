import cs from './index.less';
import { Icon } from 'lean-ui';
export default class Sider extends Component {
  state = {
    show: true
  };
  onToggle = () => {
    const { show } = this.state;
    this.setState({
      show: !show
    });
  };
  render() {
    const { children, className = '' } = this.props;
    const { show } = this.state;
    return (
      <div className={`${cs['sider']} ${show ? cs['show'] : ''} ${className}`}>
        <div className={`${cs['sider-content']} sider-content`}>
          <div className={cs['sider-content-box']}>{children}</div>
        </div>
        <div className={cs['sider-arrow']} onClick={this.onToggle}>
          <div className={cs['arrow-trigger']}>
            <Icon icon={show ? 'arrow-left' : 'arrow-right'} />
          </div>
        </div>
      </div>
    );
  }
}
