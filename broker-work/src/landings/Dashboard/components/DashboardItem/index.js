import Line from 'components/Charts/Line';
import PagePanel from 'components/PagePanel';
import Loading from './../Loading';
import cs from './DashboardItem.less';
import i18n from 'utils/i18n';
import CommissionChart from '../../path/Achievements/path/Commission/components/Chart';
import NewCustomersChart from '../../path/Achievements/path/NewCustomers/components/Chart';
import StaffPerformanceChart from '../../path/Achievements/path/StaffPerformance/components/Chart';
import TotalCustomersChart from '../../path/Achievements/path/TotalCustomers/components/Chart';
import TradeChart from '../../path/Achievements/path/Trade/components/Chart';
import DepositDistributeChart from '../../path/Achievements/path/Trade/components/DepositDistribute';
import DepositTrendChart from '../../path/Achievements/path/Trade/components/DepositTrend';
import WithdrawalTrendChart from '../../path/Achievements/path/Trade/components/WithdrawalTrend';
import ActiveCustomerChart from '../../path/CustomerData/path/ActiveCustomer/components/Chart';
import CustomerDormantChart from '../../path/CustomerData/path/CustomerDormant/components/Chart';
import CustomerRankChart from '../../path/CustomerData/path/CustomerRankings/components/Chart/customer.js';
import AccountRankChart from '../../path/CustomerData/path/CustomerRankings/components/Chart';
import CustomersChart from '../../path/CustomerData/path/Customers/components/Chart';
import TradeVarietyDistributeChart from '../../path/CustomerData/path/TradeVarietyDistribute/components/Chart';
import TransferFunnelChart from '../../path/CustomerSource/path/TransfomFunnel/components/Chart';
import TransformTrendChart from '../../path/CustomerSource/path/TransfomTrends/components/Chart';

const chartMap = {
  commission: CommissionChart,
  newCustomer: NewCustomersChart,
  staffPerformance: StaffPerformanceChart,
  totalCustomer: TotalCustomersChart,
  trade: TradeChart,
  depositTrend: DepositTrendChart,
  withdrawalTrend: WithdrawalTrendChart,
  depositDistribute: DepositDistributeChart,
  activeCustomer: ActiveCustomerChart,
  customerDormant: CustomerDormantChart,
  customerRank: CustomerRankChart,
  accountRank: AccountRankChart,
  customers: CustomersChart,
  tradeVarietyDistribute: TradeVarietyDistributeChart,
  transferFunnel: TransferFunnelChart,
  transformTrend: TransformTrendChart
};

export default class DashboardItem extends Component {
  state = {
    dataReady: false
  };
  componentDidMount() {
    const {
      item,
      getMyDashboardItem,
      myDashboardData,
      setDashboardViewRight,
      userRights,
      searchParams
    } = this.props;
    Promise.all([
      getMyDashboardItem(searchParams, item),
      setDashboardViewRight(userRights)
    ]).then(() => this.setState({ dataReady: true }));
  }
  onDelete(item) {
    const { onDelete } = this.props;
    onDelete(item);
  }
  onClick(edit, url) {
    if (!edit) {
      window.location.href = url;
    }
  }
  componentWillReceiveProps(nextProps) {
    const { getMyDashboardItem, searchParams: prevSearch, item } = this.props;
    const { searchParams: nextSearch } = nextProps;
    if (nextSearch && prevSearch && nextSearch !== prevSearch) {
      if (
        prevSearch.fromTime.format('YYYYMMDD') !==
          nextSearch.fromTime.format('YYYYMMDD') ||
        prevSearch.toTime.format('YYYYMMDD') !==
          nextSearch.toTime.format('YYYYMMDD')
      ) {
        getMyDashboardItem(nextSearch, item);
      }
    }
  }
  render() {
    const { item, myDashboardData, dashboardViewRight, edit } = this.props;
    // const size = item.chart === 'transferFunnel' ? 'lg' : 'default';
    const size = 'default';
    const Chart = chartMap[item.chart];
    if (!Chart) return null;
    const chartData = myDashboardData[item.value];
    if (!chartData) return null;
    const { dataReady } = this.state;
    return (
      <div
        className={`dashboard-item ${cs['container']} ${cs[`item-${size}`]}`}
        onClick={this.onClick.bind(this, edit, item.url)}
      >
        {edit ? (
          <span
            className={`fa fa-times ${cs['delete']}`}
            onClick={this.onDelete.bind(this, item.value)}
          />
        ) : null}
        <PagePanel>
          <PagePanel.Header>{i18n[item.label]}</PagePanel.Header>
          <PagePanel.Body>
            <div className={cs['body']}>
              {dataReady ? (
                <Chart
                  dashboardItem={item}
                  dashboardItemKey={item.value}
                  rights={dashboardViewRight}
                  {...chartData}
                />
              ) : (
                <Loading />
              )}
            </div>
          </PagePanel.Body>
        </PagePanel>
      </div>
    );
  }
}
