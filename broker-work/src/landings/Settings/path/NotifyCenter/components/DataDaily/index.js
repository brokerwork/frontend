// import Switch from 'components/Switch';
import { Icon, Select, Checkbox, Tooltip } from 'lean-ui';
import SendObjects from '../../containers/SendObjects';
import i18n from 'utils/i18n';
import cs from './DataDaily.less';
import { Form } from 'lean-ui';
const timeZone = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '0',
  '-1',
  '-2',
  '-3',
  '-4',
  '-5',
  '-6',
  '-7',
  '-8',
  '-9',
  '-10',
  '-11',
  '-12'
];
const timeZoneOptions = timeZone.map(t => ({
  label: `UTC${t >= 0 ? '+' + t : t}`,
  value: t
}));
export default class DataDaily extends PureComponent {
  constructor() {
    super();
    this.state = {
      timeZone: '8',
      sendObject: [],
      dataReady: false,
      sendPlat: false
    };
    this.changeTimeZone = this.changeTimeZone.bind(this);
    this.onSendObjectChange = this.onSendObjectChange.bind(this);
    this.onSendObjectHide = this.onSendObjectHide.bind(this);
  }
  componentDidMount() {
    const { getNotifySetting } = this.props;
    getNotifySetting().then(res => {
      if (res.result) {
        const { open = false, timeZone = '8', emails = [] } = res.data;
        this.setState({
          dataReady: true,
          sendPlat: open,
          timeZone,
          sendObject:
            typeof emails[0] === 'string'
              ? emails.map(e => JSON.parse(e))
              : emails
        });
      }
    });
  }
  changeTimeZone(t) {
    const { sendPlat } = this.state;
    this.onSubmit(sendPlat, Number(t)).then(res => {
      if (res.result) {
        this.setState({
          timeZone: t
        });
      }
    });
  }
  onSendObjectChange(options) {
    this.setState(
      {
        sendObject: options
      },
      () => {
        this.onSwitch();
      }
    );
  }
  onSendObjectHide() {
    // this.onSubmit(false);
  }
  onSubmit(open, tzone) {
    const { timeZone, sendObject } = this.state;
    const { saveNotifySetting } = this.props;
    return saveNotifySetting({
      open,
      timeZone: tzone === undefined ? timeZone : tzone,
      emails: sendObject.map(s => ({ name: s.name, id: s.id })),
      userIds: sendObject.map(s => s.id)
    });
  }
  onSwitch() {
    let { sendPlat } = this.state;
    const { showTopAlert, showTipsModal } = this.props;
    if (!sendPlat) {
      this.onSubmit(false).then(res => {
        if (res.result) {
          showTopAlert({
            content: i18n['general.disabled_success'],
            bsStyle: 'success'
          });
        }
      });
    } else {
      const { sendObject } = this.state;
      if (sendObject && sendObject.length) {
        this.onSubmit(true).then(res => {
          if (res.result) {
            showTopAlert({
              content: i18n['account.create_account.create_success'],
              bsStyle: 'success'
            });
          }
        });
      }
    }
  }
  chooseSendType = (type, e) => {
    let checked = e.target.checked;
    if (type === 'personal') {
      this.props.updateNotifyWay('PersonalDailyReport');
    } else if (type === 'plat') {
      this.setState(
        {
          sendPlat: checked
        },
        () => {
          this.onSwitch();
        }
      );
    }
  };
  render() {
    const { sendPlat, timeZone, sendObject, dataReady } = this.state;
    const { systemSettings = {}, vasSwitch } = this.props;
    return (
      <div>
        <div className={cs['module-header']}>
          {i18n['settings.self_notify.data_report_setting']}
          <a
            target="_blank"
            href="https://broker-upload.oss-cn-hangzhou.aliyuncs.com/bwstatic/datareport.png"
            className={`${cs['pop-icon']}`}
          >
            <Icon fontType="bw" icon="preview" />
            {i18n['setting.message.template.preview']}
          </a>
        </div>
        {dataReady ? (
          <table className={cs['formTable']}>
            <tr>
              <td className={cs['formLabel']}>
                {i18n['settings.notify_center.time_zone']}
              </td>
            </tr>
            <tr>
              <td>
                <div className={cs['formControl']}>
                  <div className={cs['select']}>
                    <Select
                      onSelect={this.changeTimeZone}
                      value={`${timeZone}`}
                    >
                      {timeZoneOptions.map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.value}>
                            {item.label}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </div>
                  <span className={cs['time-zone']}>8:00</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className={cs['formLabel']}>
                {i18n['settings.notify_center.sendType']}
                <Tooltip
                  placement="right"
                  trigger="click"
                  title={
                    <div>
                      {i18n['settings.notify_center.report.tip1']}
                      <br />
                      {i18n['settings.notify_center.report.tip2']}
                    </div>
                  }
                >
                  <Icon className={cs['question']} icon="question" />
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td>
                <div className={cs['formControl']}>
                  <div className={cs['checkobx']}>
                    <Checkbox
                      disabled={!vasSwitch.EMAIL}
                      className={cs['checkbox']}
                      checked={systemSettings.personalDailyReportEnable}
                      onChange={this.chooseSendType.bind(this, 'personal')}
                    >
                      {i18n['settings.notify_center.report.personal']}
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
                      className={cs['checkbox']}
                      checked={sendPlat}
                      onChange={this.chooseSendType.bind(this, 'plat')}
                    >
                      {i18n['settings.notify_center.report.plat']}
                    </Checkbox>
                  </div>
                </div>
              </td>
            </tr>
            {sendPlat && [
              <tr>
                <td className={cs['formLabel']}>
                  {i18n['settings.notify_center.receiver']}
                </td>
              </tr>,
              <tr>
                <td>
                  <SendObjects
                    onHide={this.onSendObjectHide}
                    onChange={this.onSendObjectChange}
                    data={sendObject}
                  />
                </td>
              </tr>
            ]}
          </table>
        ) : null}
      </div>
    );
  }
}
