import Panel from 'components/Panel';
import DateRangePicker from 'components/DateRangePicker';
import Table from 'components/Table';
import cs from './ValueAddedService.less';
import i18n from 'utils/i18n';

export default class ValueAddedService extends PureComponent {
  componentDidMount() {
    this.getValueAddedService();
  }

  getValueAddedService = () => {
    const { getValueAddedService, valueAddedServiceDateRange } = this.props;

    getValueAddedService(valueAddedServiceDateRange);
  };

  onDateRangeChange = range => {
    const { _changeValueAddedServiceDataRange } = this.props;

    Promise.resolve(_changeValueAddedServiceDataRange(range)).then(() => {
      this.getValueAddedService();
    });
  };

  render() {
    const {
      valueAddedService,
      valueAddedServiceDateRange,
      email,
      sms,
      internationalSms,
      verification,
      voip
    } = this.props;
    return (
      <Panel header={i18n['consumption.vas.title']}>
        <div className={cs['actions-bar']}>
          <DateRangePicker inline value={valueAddedServiceDateRange} onChange={this.onDateRangeChange} />
        </div>
        {sms || email ? (
          <Table>
            <Table.Header>
              <th>{i18n['consumption.vas.type']}</th>
              <th>{i18n['consumption.vas.request']}</th>
              <th>{i18n['consumption.vas.delivered']}</th>
              <th>{i18n['consumption.vas.failure']}</th>
              <th>{i18n['consumption.vas.number']}</th>
              <th>{i18n['consumption.vas.amount']}</th>
            </Table.Header>
            <Table.Body>
              {sms ? (
                <tr>
                  <td>{i18n['consumption.vas.sms']}</td>
                  <td>{valueAddedService.smsRequestNum}</td>
                  <td>{valueAddedService.smsDeliveredNum}</td>
                  <td>{valueAddedService.smsFailureNum}</td>
                  <td>{valueAddedService.smsRequestNum}</td>
                  <td>${valueAddedService.smsAmount}</td>
                </tr>
              ) : null}
              {sms ? (
                <tr>
                  <td>{i18n['consumption.vas.internationalSms']}</td>
                  <td>{valueAddedService.internationalSmsRequestNum}</td>
                  <td>{valueAddedService.internationalSmsDeliveredNum}</td>
                  <td>{valueAddedService.internationalSmsFailureNum}</td>
                  <td>{valueAddedService.internationalSmsRequestNum}</td>
                  <td>${valueAddedService.internationalSmsAmount}</td>
                </tr>
              ) : null}
              {email ? (
                <tr>
                  <td>{i18n['consumption.vas.email']}</td>
                  <td>{valueAddedService.emailRequestNum}</td>
                  <td>{valueAddedService.emailDeliveredNum}</td>
                  <td>{valueAddedService.emailFailureNum}</td>
                  <td>{valueAddedService.emailRequestNum}</td>
                  <td>${valueAddedService.emailAmount}</td>
                </tr>
              ) : null}
            </Table.Body>
          </Table>
        ) : null}
        {voip ? (
          <Table>
            <Table.Header>
              <th>{i18n['consumption.vas.type']}</th>
              <th>{i18n['consumption.vas.called_num']}</th>
              <th>{i18n['consumption.vas.caller_num']}</th>
              <th>{i18n['consumption.vas.talk_time']}</th>
              <th>{i18n['consumption.vas.voip_amount']}</th>
              <th>{i18n['consumption.vas.record_size']}</th>
              <th>{i18n['consumption.vas.record_amount']}</th>
            </Table.Header>
            <Table.Body>
              <tr>
                <td>{i18n['consumption.vas.voip']}</td>
                <td>{valueAddedService.calledNum}</td>
                <td>{valueAddedService.callerNum}</td>
                <td>{valueAddedService.talkSum}</td>
                <td>${valueAddedService.voipAmount}</td>
                <td>{valueAddedService.recordSize}</td>
                <td>${valueAddedService.recordAmount}</td>
              </tr>
            </Table.Body>
          </Table>
        ) : null}
        {verification ? (
          <Table>
            <Table.Header>
              <th>{i18n['consumption.vas.type']}</th>
              <th>{i18n['consumption.vas.id_check_times']}</th>
              <th>{i18n['consumption.vas.card_check_times']}</th>
              <th>{i18n['consumption.vas.id_check_sum']}</th>
            </Table.Header>
            <Table.Body>
              <tr>
                <td>{i18n['consumption.vas.id']}</td>
                <td>{valueAddedService.idVerificationCounter}</td>
                <td>{valueAddedService.cardVerificationCounter}</td>
                <td>${valueAddedService.verificationAmount}</td>
              </tr>
            </Table.Body>
          </Table>
        ) : null}
      </Panel>
    );
  }
}
