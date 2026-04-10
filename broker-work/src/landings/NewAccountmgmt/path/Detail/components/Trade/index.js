import DateRangePicker from 'components/v2/DateRangePicker';
import cs from './Trade.less';
import Balance from './Balance';
import Position from './Position';
import Deal from './Deal';
import Order from './Order';
import { dateRange } from 'utils/config';
import { Collapse } from 'lean-ui';
import i18n from 'utils/i18n';
let cuServer = {
  vendor: location.search && location.search.split('&')[0].split('=')[1],
  serverId: location.search && location.search.split('&')[1].split('=')[1]
};
const defaultRanges = {
  [i18n['general.date_range_picker.option.all']]: dateRange.all,
  [i18n['general.date_range_picker.option.today']]: dateRange.today,
  [i18n['general.date_range_picker.option.yestoday']]: dateRange.yestoday,
  [i18n['general.date_range_picker.option.last7days']]: dateRange.last7days,
  [i18n['general.date_range_picker.option.last30days']]: dateRange.last30days,
  [i18n['general.date_range_picker.option.currentMonth']]:
    dateRange.currentMonth,
  [i18n['general.date_range_picker.option.lastMonth']]: dateRange.lastMonth
};

export default class Trade extends PureComponent {
  state = {
    startDate: dateRange.last7days.start,
    endDate: dateRange.last7days.end,
    dateChanged: false,
    activeKey: []
  };
  activeKeyChange: false;

  componentDidMount() {
    ['balance', 'position', 'deal', 'order'].map(t => this.load(t, 1, true));
  }

  onChange = ({ startDate, endDate }) => {
    this.setState({
      startDate,
      endDate,
      dateChanged: true
    });
  };

  load = (type, pageNo, desc) => {
    const { getTradeList, currentServer, accountId } = this.props;
    const { startDate, endDate } = this.state;

    getTradeList(
      type,
      accountId,
      {
        from: startDate ? startDate.valueOf() : '',
        to: endDate ? endDate.valueOf() : '',
        pageNo,
        desc
      },
      cuServer
    );
    this.setState({
      dateChanged: false
    });
  };

  getTotal(data) {
    if (data) {
      if (data.trade) {
        if (data.trade.total) {
          return data.trade.total;
        }
      }
    }
    return 0;
  }
  onColChange = key => {
    this.activeKeyChange = true;
    this.setState({
      activeKey: key
    });
  };
  render() {
    const { startDate, endDate, dateChanged, activeKey } = this.state;
    const { tradeList, currentServer } = this.props;
    const balanceTotal = this.getTotal(tradeList['balance']);
    const positionTotal = this.getTotal(tradeList['position']);
    const dealTotal = this.getTotal(tradeList['deal']);
    const orderTotal = this.getTotal(tradeList['order']);
    const isCustom =
      currentServer.vendor && currentServer.vendor.indexOf('CUSTOM') > -1;
    return (
      <div className={`${cs['trade']} trade`}>
        <div className={cs['actions']}>
          <DateRangePicker
            className={cs['picker']}
            onChange={this.onChange}
            defaultValue={{ startDate, endDate }}
            ranges={defaultRanges}
          />
        </div>
        <Collapse
          activeKey={
            this.activeKeyChange ? activeKey : balanceTotal * 1 > 0 ? ['0'] : []
          }
          onChange={this.onColChange}
        >
          <Collapse.Item
            disabled={!balanceTotal}
            title={`${
              i18n['account.detail.trade_record.balance']
            } (${balanceTotal})`}
          >
            <Balance
              load={this.load.bind(this, 'balance')}
              list={tradeList['balance']}
              dateChanged={dateChanged}
            />
          </Collapse.Item>
          {/* 自定义平台隐藏 */}
          {!isCustom && (
            <Collapse.Item
              disabled={!positionTotal}
              title={`${
                i18n['account.detail.trade_record.position']
              } (${positionTotal})`}
            >
              <Position
                currentServer={currentServer}
                load={this.load.bind(this, 'position')}
                list={tradeList['position']}
                dateChanged={dateChanged}
                currentServer={currentServer}
              />
            </Collapse.Item>
          )}
          {!isCustom && (
            <Collapse.Item
              disabled={!dealTotal}
              title={`${
                i18n['account.detail.trade_record.deal']
              } (${dealTotal})`}
            >
              <Deal
                currentServer={currentServer}
                load={this.load.bind(this, 'deal')}
                list={tradeList['deal']}
                dateChanged={dateChanged}
              />
            </Collapse.Item>
          )}
          {!isCustom && (
            <Collapse.Item
              disabled={!orderTotal}
              title={`${
                i18n['account.detail.trade_record.order']
              } (${orderTotal})`}
            >
              <Order
                load={this.load.bind(this, 'order')}
                list={tradeList['order']}
                dateChanged={dateChanged}
              />
            </Collapse.Item>
          )}
        </Collapse>
      </div>
    );
  }
}
