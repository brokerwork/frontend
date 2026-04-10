import LineAndBar from 'components/Charts/LineAndBar';
import cs from './WithdrawalTrend.less';
import i18n from 'utils/i18n';

export default class WithdrawalTrend extends PureComponent {
  parseData = () => {
    const { data } = this.props;

    const result = data.reduce(
      (value, currentValue) => {
        value['NEW_WITHDRAWAL_CUSTOMER_PAGE'].push(
          currentValue['NEW_WITHDRAWAL_CUSTOMER_PAGE']
        );
        value['NEW_WITHDRAWAL_CUSTOMER_PAGE_AVERAGE'].push(
          currentValue['NEW_WITHDRAWAL_CUSTOMER_PAGE_AVERAGE']
        );

        return value;
      },
      {
        NEW_WITHDRAWAL_CUSTOMER_PAGE: [],
        NEW_WITHDRAWAL_CUSTOMER_PAGE_AVERAGE: []
      }
    );

    return [
      {
        data: result['NEW_WITHDRAWAL_CUSTOMER_PAGE'],
        type: 'bar',
        name: i18n['dashboard.data_type.NEW_WITHDRAWAL_CUSTOMER_PAGE']
      },
      {
        data: result['NEW_WITHDRAWAL_CUSTOMER_PAGE_AVERAGE'],
        type: 'line',
        name: i18n['dashboard.data_type.NEW_WITHDRAWAL_CUSTOMER_PAGE_AVERAGE']
      }
    ];
  };

  render() {
    const { labels } = this.props;
    const data = this.parseData();

    return (
      <div className={cs['container']}>
        <div className={cs['chart']}>
          <div className={cs['chart-wraper']}>
            <LineAndBar data={data} labels={labels} />
          </div>
        </div>
      </div>
    );
  }
}
