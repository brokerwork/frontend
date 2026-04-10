import { Switch, Select, Tooltip, Icon } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './DataDaily.less';
// import Tips from 'components/v2/Tips';
const Option = Select.Option;
const timeZone = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  0,
  -1,
  -2,
  -3,
  -4,
  -5,
  -6,
  -7,
  -8,
  -9,
  -10,
  -11,
  -12
];
const timeZoneOptions = timeZone.map(t => ({
  label: `UTC${t >= 0 ? '+' + t : t}`,
  value: t === 0 ? 'zero' : t
}));
export default class DataDaily extends PureComponent {
  constructor() {
    super();
    this.state = {
      reportOpen: false,
      timeZone: 8,
      dataReady: false
    };
    this.changeTimeZone = this.changeTimeZone.bind(this);
    this.openChange = this.openChange.bind(this);
    this.onSwitch = this.onSwitch.bind(this);
  }
  componentDidMount() {
    const { getPersonalReport } = this.props;
    getPersonalReport().then(res => {
      if (res.result) {
        const { open = false, timeZone = 8, emails = [] } = res.data;
        this.setState({
          dataReady: true,
          reportOpen: open,
          timeZone
        });
      }
    });
  }
  changeTimeZone(t) {
    const { reportOpen } = this.state;
    this.onSubmit(reportOpen, t === 'zero' ? 0 : t).then(res => {
      if (res.result) {
        this.setState({
          timeZone: t
        });
      }
    });
  }
  openChange(openState) {
    this.setState({
      reportOpen: openState
    });
  }
  onSubmit(open, tzone) {
    const { timeZone } = this.state;
    const { setPersonalReport } = this.props;
    return setPersonalReport({
      open,
      timeZone: tzone === undefined ? timeZone : tzone,
      level: 'USER'
    });
  }
  onSwitch() {
    const { showTopAlert, showTipsModal } = this.props;
    const { reportOpen } = this.state;
    if (reportOpen) {
      this.onSubmit(false).then(res => {
        if (res.result) {
          showTopAlert({
            content: i18n['general.disabled_success'],
            bsStyle: 'success'
          });
          this.setState({
            reportOpen: false
          });
        }
      });
    } else {
      this.onSubmit(true).then(res => {
        if (res.result) {
          showTopAlert({
            content: i18n['general.open_success'],
            bsStyle: 'success'
          });
          this.setState({
            reportOpen: true
          });
        }
      });
    }
  }
  render() {
    let { reportOpen, timeZone, dataReady } = this.state;
    timeZone = timeZone === 0 ? 'zero' : timeZone;
    return (
      <div className={cs['data-daily']}>
        <div className={cs['header']}>
          {i18n['settings.self_notify.data_report_setting']}
          <Tooltip
            trigger="click"
            placement="right"
            title={i18n['settings.self_notify.data_report.header_tips']}
          >
            <Icon className={cs["tip"]} icon="question" />
          </Tooltip>
        </div>
        {dataReady ? (
          <div className={cs['send']}>
            <div className={cs['label']}>
              <span className={cs['text']}>
                {i18n['settings.self_notify.data_report_send']}:
              </span>
              <Switch checked={reportOpen} onChange={this.onSwitch} />
            </div>
            <div className={cs['label']}>
              <span className={cs['text']}>
                {i18n['settings.notify_center.time_zone']}:
              </span>
              <Select value={timeZone} onSelect={this.changeTimeZone}>
                {timeZoneOptions.map((el, index) => {
                  return (
                    <Option key={index} value={el.value}>
                      {el.label}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
