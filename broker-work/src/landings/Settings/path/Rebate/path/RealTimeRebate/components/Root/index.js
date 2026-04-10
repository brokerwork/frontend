import cs from './Root.less';
import i18n from 'utils/i18n';
import ConfirmModal from '../../containers/ConfirmModal';
import { Button } from 'lean-ui';

export default class Root extends PureComponent {
  state = {
    showConfirmModal: false
  };

  componentDidMount() {
    const { getRealTimeStatus, functionType } = this.props;
    getRealTimeStatus(functionType);
  }

  showConfirmModal = () => {
    this.setState({
      showConfirmModal: true
    });
  };

  closeConfirmModal = () => {
    this.setState({
      showConfirmModal: false
    });
  };

  render() {
    const { realTimeStatus, ruleType, className = '', ...props } = this.props;
    const { showConfirmModal } = this.state;
    // 添加【模式二】的实时返佣功能 // 目前 【模式二】 没有实时返佣功能
    // if (ruleType === 4) return null;
    return (
      <div className={`${cs['wrapper']} ${className}`}>
        <Button onClick={this.showConfirmModal}>
          {realTimeStatus.rcrEnable
            ? realTimeStatus.status === 0
              ? i18n['settings.rebate_setting.enable_rt_rebate']
              : realTimeStatus.type === 0
                ? i18n['settings.rebate_setting.disable_auto_rebate']
                : i18n['settings.rebate_setting.disable_rt_rebate']
            : realTimeStatus.status === 0
              ? i18n['settings.rebate_setting.enable_auto_rebate']
              : i18n['settings.rebate_setting.disable_auto_rebate']}
        </Button>
        {showConfirmModal ? (
          <ConfirmModal onHide={this.closeConfirmModal} {...props} />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
