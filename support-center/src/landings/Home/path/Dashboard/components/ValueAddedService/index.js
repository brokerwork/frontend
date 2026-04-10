import Panel from 'components/Panel';
import Switch from 'components/Switch';
import cs from './ValueAddedService.less';
import EnableService from '../../containers/EnableService';
import i18n from 'utils/i18n';

export default class ValueAddedService extends PureComponent {
  state = {
    showEnableServiceModal: false,
    type: null
  };

  showEnableServiceModal = type => {
    this.setState({
      showEnableServiceModal: true,
      type
    });
  };

  closeEnableServiceModal = () => {
    this.setState({
      showEnableServiceModal: false
    });
  };

  confirmSubmit = type => {
    const { tenantInfo, showTipsModal } = this.props;
    if (!tenantInfo[type].enabled) {
      showTipsModal({ content: i18n['dashboard.vas.open.service.tips'], onConfirm: cb => cb() });
      return false;
    }
    return true;
  };

  onEnableService = () => {
    const { getTenantInfo } = this.props;

    getTenantInfo().then(({ result }) => {
      if (result) {
        this.closeEnableServiceModal();
      }
    });
  };

  onSwitch = (type, checked) => {
    const { tenantInfo, showTopAlert, showTipsModal, disableService, getTenantInfo, getMenu } = this.props;

    if (!tenantInfo[type].flag) {
      this.showEnableServiceModal(type);
    } else {
      if (type === 'sms') {
        showTopAlert({
          content: i18n['dashboard.vas.open.sms.tips']
        });
        return;
      }
      showTipsModal({
        content: i18n['dashboard.vas.disable.service.tips'],
        onConfirm: cb => {
          disableService(type).then(({ result }) => {
            if (result) {
              getTenantInfo().then(res => {
                if (res.result) {
                  showTopAlert({
                    style: 'success',
                    content: i18n['general.modify_success']
                  });
                  getMenu();
                }
              });
            }
          });
          cb();
        }
      });
    }
  };

  render() {
    const { tenantInfo } = this.props;
    const { showEnableServiceModal, type } = this.state;

    return (
      <Panel header={i18n['dashboard.vas.title']}>
        <div className={cs['panel']}>
          <div className={cs['service']}>
            <div className={cs['title']}>{i18n['dashboard.vas.verification']}</div>
            <Switch
              className={cs['switch']}
              checked={tenantInfo.verification.flag}
              onChange={this.onSwitch.bind(this, 'verification')}
            />
            <a onClick={this.showEnableServiceModal.bind(this, 'verification')}>
              {i18n['dashboard.vas.service.introduction']}
            </a>
          </div>

          <div className={cs['service']}>
            <div className={cs['title']}>{i18n['dashboard.vas.sms']}</div>
            <Switch className={cs['switch']} checked={tenantInfo.sms.flag} onChange={this.onSwitch.bind(this, 'sms')} />
            <a onClick={this.showEnableServiceModal.bind(this, 'sms')}>{i18n['dashboard.vas.service.introduction']}</a>
          </div>
          {/* <div className={cs['service']}>
            <div className={cs['title']}>{i18n['dashboard.vas.voip']}</div>
            <Switch
              className={cs['switch']}
              checked={tenantInfo.voip.flag}
              onChange={this.onSwitch.bind(this, 'voip')}
            />
            <a onClick={this.showEnableServiceModal.bind(this, 'voip')}>{i18n['dashboard.vas.service.introduction']}</a>
          </div> */}
          <div className={cs['service']}>
            <div className={cs['title']}>{i18n['dashboard.vas.email']}</div>
            <Switch
              className={cs['switch']}
              checked={tenantInfo.email.flag}
              onChange={this.onSwitch.bind(this, 'email')}
            />
            <a onClick={this.showEnableServiceModal.bind(this, 'email')}>
              {i18n['dashboard.vas.service.introduction']}
            </a>
          </div>
          {/* <div className={cs['service']}>
            <div className={cs['title']}>{i18n['dashboard.vas.live']}</div>
            <div style={{ visibility: 'hidden' }}>
              <Switch className={cs['switch']} checked={false} />
            </div>
            <a onClick={this.showEnableServiceModal.bind(this, 'live')}>{i18n['dashboard.vas.service.introduction']}</a>
          </div> */}
        </div>
        {showEnableServiceModal ? (
          <EnableService
            onClose={this.closeEnableServiceModal}
            onSave={this.onEnableService}
            confirmSubmit={this.confirmSubmit}
            type={type}
          />
        ) : (
          undefined
        )}
      </Panel>
    );
  }
}
