import cs from './ImportantNotification.less';
import i18n from 'utils/i18n';
import { Checkbox, Popover, Switch, Tooltip } from 'lean-ui';

export default class ImportantNotification extends PureComponent {
  onSwitch = type => {
    console.log('onswitch ', type);
    const { switchMain, updateNotifyWay } = this.props;
    if (type === 'enable') {
      switchMain();
    } else {
      updateNotifyWay(type);
    }
  };
  render() {
    const { systemSettings, vasSwitch } = this.props;

    return (
      <div className={cs['content']}>
        <table className={cs['formTable']}>
          <tr>
            <td className={`${cs['formLabel']} ${cs['real_time']}`}>
              <span className={cs['formInlineLabel']}>
                {i18n['settings.important_notify.real_time_notify']}:
              </span>
              <Switch
                checked={systemSettings.enable}
                onChange={this.onSwitch.bind(this, 'enable')}
              />
            </td>
          </tr>
          {systemSettings.enable && (
            <tr>
              <td className={cs['sm']}>
                <div className={cs['send-way']}>
                  {i18n['settings.important_notify.send_way']}
                </div>
                <Checkbox
                  disabled={!vasSwitch.EMAIL}
                  className={cs['checkbox']}
                  checked={systemSettings.emailEnable || false}
                  onChange={this.onSwitch.bind(this, 'Email')}
                >
                  {i18n['settings.important_notify.email_notify']}
                </Checkbox>
                {!vasSwitch.EMAIL && (
                  <Tooltip
                    placement="right"
                    trigger="click"
                    title={
                      <div className={cs['report-content']}>
                        {
                          i18n[
                            'settings.notify_center.data_report.email_switch_tips'
                          ]
                        }
                      </div>
                    }
                  >
                    <span
                      className={`${cs['tips']} fa fa-exclamation-circle`}
                    />
                  </Tooltip>
                )}
                <Checkbox
                  disabled={!vasSwitch.SMS}
                  className={cs['checkbox']}
                  checked={systemSettings.smsEnable || false}
                  onChange={this.onSwitch.bind(this, 'SMS')}
                >
                  {i18n['settings.important_notify.sms_notify']}
                </Checkbox>
                {!vasSwitch.SMS && (
                  <Tooltip
                    placement="right"
                    trigger="click"
                    title={
                      <div className={cs['report-content']}>
                        {
                          i18n[
                            'settings.notify_center.data_report.sms_switch_tips'
                          ]
                        }
                      </div>
                    }
                  >
                    <span
                      className={`${cs['tips']} fa fa-exclamation-circle`}
                    />
                  </Tooltip>
                )}
              </td>
            </tr>
          )}
        </table>
        <span className={cs['real-time-tips']}>
          {i18n['settings.important_notify.real_time_notify_tips']}
        </span>
      </div>
    );
  }
}
