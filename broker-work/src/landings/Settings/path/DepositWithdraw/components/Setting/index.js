import PagePanel from 'components/PagePanel';
import SettingInfo from '../SettingInfo';
import UpdateSetting from '../../containers/UpdateSetting';
import { SETTING_TYPE } from '../../constant';
import { Button, Icon, Tooltip, Switch } from 'lean-ui';
import cs from './Setting.less';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
// import Popover from 'components/v2/Popover';

export default class Setting extends PureComponent {
  state = {
    showSettingInfoModal: false,
    showUpdateSettingModal: false,
    checked: true
  };

  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  onSave = () => {
    const { getDepositWithdrawInfo } = this.props;

    this.setState(
      {
        showUpdateSettingModal: false
      },
      () => {
        getDepositWithdrawInfo();
      }
    );
  };

  _renderInfo(type) {
    const { depositWithdrawInfo } = this.props;

    return (
      <ul className={cs['info-content']}>
        {(depositWithdrawInfo[type] || []).map((item, idx) => {
          return (
            <li key={idx}>
              <Icon
                icon={item.selected ? 'success' : 'error'}
                className={`${item.selected ? 'active' : ''} ${cs['icon']} 
                ${item.selected ? 'main-color' : cs.colorError}`}
              />
              {item.typeName}{' '}
              {item.regular === 'lean-work-other-' ? (
                <Tooltip
                  placement="top"
                  trigger="click"
                  className={cs['tips-popover']}
                  title={i18n['settings.deposit_withdraw.other_type.tips']}
                >
                  <Icon icon="info-outline" className={`${cs['infoIcon']}`} />
                </Tooltip>
              ) : (
                undefined
              )}
            </li>
          );
        })}
      </ul>
    );
  }
  onSwitch = isChecked => {
    const data = ['AccountSummary', 'Deposit', 'NetDeposit'];
    if (isChecked) {
      data.push('AccountDw');
    }
    this.props.enableStat(data).then(rs => {
      if (rs.result) {
        this.props.showTopAlert({
          bsStyle: 'success',
          content: i18n['account.create_account.create_success']
        });
      }
    });
    this.setState({
      loading: true,
      checked: isChecked
    });
  };
  componentDidMount() {
    this.props.getStat().then(rs => {
      if (rs.result) {
        this.setState({
          checked: rs.data.includes('AccountDw')
        });
      }
    });
  }
  render() {
    const {
      showSettingInfoModal,
      showUpdateSettingModal,
      checked
    } = this.state;

    return (
      <PagePanel>
        <PagePanel.Header className={cs.header}>
          <div className={cs.headerWrapper}>
            <div className={cs.actionBar}>
              {i18n['settings.deposit_withdraw.setting']}
              <Button
                type="default"
                onClick={this.toggleModal.bind(this, 'UpdateSetting', true)}
              >
                {i18n['general.edit']}
              </Button>
            </div>
            <div className={cs['tips']}>
              <FormattedMessage
                id="settings.deposit_withdraw.setting.tips"
                defaultMessage={
                  i18n['settings.deposit_withdraw.setting.tips.new']
                }
                values={{
                  link: (
                    <a
                      className={cs['link']}
                      onClick={this.toggleModal.bind(this, 'SettingInfo', true)}
                    >
                      {i18n['settings.deposit_withdraw.setting.tips.check.new']}
                    </a>
                  )
                }}
              />
              <Switch
                className={cs.switch}
                checked={checked}
                onChange={this.onSwitch}
              />
              <span>{i18n['settings.deposit_withdraw.enable']}</span>
            </div>
          </div>
        </PagePanel.Header>
        <PagePanel.Body className={cs.body}>
          {SETTING_TYPE.map((item, idx) => {
            return (
              <div key={idx} className={cs['info']}>
                <div className={cs['info-header']}>
                  <FormattedMessage
                    id="settings.deposit_withdraw.setting.type_title"
                    defaultMessage={
                      i18n['settings.deposit_withdraw.setting.type_title']
                    }
                    values={{ type: item.label }}
                  />
                </div>
                {this._renderInfo(item.value)}
              </div>
            );
          })}
          {showSettingInfoModal && (
            <SettingInfo
              onClose={this.toggleModal.bind(this, 'SettingInfo', false)}
            />
          )}
          {showUpdateSettingModal && (
            <UpdateSetting
              onSave={this.onSave}
              onClose={this.toggleModal.bind(this, 'UpdateSetting', false)}
            />
          )}
        </PagePanel.Body>
      </PagePanel>
    );
  }
}
