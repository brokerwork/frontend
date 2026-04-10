import Header from './../Header';
import { Table, Button, Dialog, Radio, Form, TimePicker, Icon } from 'lean-ui';
import cs from './index.less';
import i18n from 'utils/i18n';
import moment from 'moment';
import { findDOMNode } from 'react-dom';
import customReportTypes from 'utils/customReportTypes';
import List from '../../containers/List';
import _ from 'lodash';

const format = 'HH:mm';
const addon = () => {
  return (
    <div>
      <Button type="primary">{i18n['general.confirm']}</Button>
    </div>
  );
};

export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showUpdateRate: false,
      showUpdateRateType: 'hour',
      timerOpen: false,
      timeVal: moment('08:00', format),
      showReportType: false,
      reportType: ''
    };
  }

  saveRef = node => {
    this.triger = node;
  };
  onCancel = key => {
    this.setState({
      [key]: false
    });
  };
  onUpdateRateType = type => {
    this.setState({
      showUpdateRateType: type
    });
  };
  onOpen = () => {
    this.setState({
      timerOpen: true
    });
  };
  selectTime = () => {
    this.setState({
      timerOpen: false
    });
  };
  onTimeChange = time => {
    this.setState({
      timeVal: time
    });
  };
  onTimeConfirm = () => {
    this.setState({
      timerOpen: false
    });
  };
  onReportChange = type => {
    this.setState({
      reportType: type
    });
  };
  goEditPage = () => {
    const { reportType } = this.state;
    const {
      history: { push }
    } = this.props;
    push(`/reportmgmt/customReport/create?reportType=${reportType}`);
  };
  componentDidMount() {
    const { getCustomReportList, pageParam, getSettleTime } = this.props;
    getCustomReportList(pageParam);
    getSettleTime().then(res => {
      if (res.result) {
        const time = _.get(res, 'data.time', '08:00');
        this.setState({
          timeVal: moment(time, format)
        });
      }
    });
  }
  onUpdateSettleTime = () => {
    const { setSettleTime } = this.props;
    const { timeVal } = this.state;
    setSettleTime({
      time: timeVal
    });
    this.setState({
      showUpdateRate: false
    });
  };
  render() {
    const {
      showUpdateRate,
      showUpdateRateType,
      timeVal,
      timerOpen,
      showReportType,
      reportType
    } = this.state;
    return (
      <div>
        <Header title={i18n['settings.custom_report_mgmt']}>
          <div className={`${cs['action-area']}`}>
            <Button
              type="primary"
              href="/settings/customReport/create"
              onClick={() => this.setState({ showReportType: true })}
            >
              <Icon icon="add" />
              {i18n['settings.custom_report_mgmt.create']}
            </Button>
            <div className={`${cs['down']}`}>
              <Button onClick={() => this.setState({ showUpdateRate: true })}>
                {i18n['settings.custom_report_mgmt.update_rate.title']}
              </Button>
            </div>
          </div>
        </Header>
        <List />
        <Dialog
          onCancel={this.onCancel.bind(this, 'showReportType')}
          title={i18n['settings.custom_report_mgmt.select_report_type']}
          visible={showReportType}
          footer={
            <div>
              <Button onClick={this.onCancel.bind(this, 'showReportType')}>
                {i18n['general.cancel']}
              </Button>
              <Button
                type="primary"
                disabled={!reportType}
                onClick={this.goEditPage}
              >
                {i18n['general.continue']}
              </Button>
            </div>
          }
        >
          <ul className={cs['report-type-select']}>
            {customReportTypes.map(t => (
              <li
                key={t}
                className={`custom-report-type ${
                  reportType === t ? 'checked' : ''
                }`}
                onClick={this.onReportChange.bind(this, t)}
              >
                {i18n[`report.custom_report.type.${t}`]}
              </li>
            ))}
          </ul>
        </Dialog>
        <Dialog
          onCancel={this.onCancel.bind(this, 'showUpdateRate')}
          title={i18n['settings.custom_report_mgmt.update_rate.title']}
          visible={showUpdateRate}
          footer={
            <div>
              <Button type="primary" onClick={this.onUpdateSettleTime}>
                {i18n['general.confirm']}
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    showUpdateRate: false
                  })
                }
              >
                {i18n['general.cancel']}
              </Button>
            </div>
          }
        >
          <div className={cs['actions']}>
            <Form.Item>
              <Form.Label>
                {i18n['settings.custom_report_mgmt.update_rate.settle_time']}
              </Form.Label>
              <TimePicker
                value={timeVal}
                onChange={this.onTimeChange}
                open={timerOpen}
                onOpen={this.onOpen}
                format={format}
                showSecond={false}
                addon={() => (
                  <div>
                    <Button type="primary" onClick={this.onTimeConfirm}>
                      {i18n['general.confirm']}
                    </Button>
                  </div>
                )}
              />
            </Form.Item>
            <p>{i18n['settings.custom_report_mgmt.update_rate.warning1']}</p>
            <p>{i18n['settings.custom_report_mgmt.update_rate.warning2']}</p>
            <p>{i18n['settings.custom_report_mgmt.update_rate.warning3']}</p>
            <p>{i18n['settings.custom_report_mgmt.update_rate.warning4']}</p>
            <p>{i18n['settings.custom_report_mgmt.update_rate.warning5']}</p>
          </div>
        </Dialog>
      </div>
    );
  }
}
