import PagePanel from 'components/PagePanel';
import i18n from 'utils/i18n';
import DateRangePicker from 'landings/Dashboard/components/DateRangePicker';
import Chart from '../Chart';
import CustomerChart from '../Chart/customer';
import AddToWorkbench from 'landings/Dashboard/containers/AddToWorkbench';
import cs from 'landings/Dashboard/components/common.less';
import rcs from './Root.less';
import NoPermissionView from 'components/NoPermissionView';

const customerRankParams = [
  'CUSTOMER_RANK_DEPOSIT',
  'CUSTOMER_RANK_WITHDRAWAL',
  'CUSTOMER_RANK_NET_DEPOSIT',
  'CUSTOMER_RANK_DEAL_VOLUME',
  'CUSTOMER_RANK_PROFIT',
  'CUSTOMER_RANK_LOSS'
];

const accountRankParams = [
  'ACCOUNT_RANK_DEPOSIT',
  'ACCOUNT_RANK_WITHDRAWAL',
  'ACCOUNT_RANK_NET_DEPOSIT',
  'ACCOUNT_RANK_DEAL_VOLUME',
  'ACCOUNT_RANK_PROFIT',
  'ACCOUNT_RANK_LOSS'
];

export default class Root extends PureComponent {
  constructor(props) {
    super(props);
    const { userRights } = props;
    const hasCustomerRight = userRights['CUSTOMER_SELECT'];
    const hasAccoutRight =
      userRights['ACCOUNT_SELECT_DIRECTLY_TRADE'] ||
      userRights['ACCOUNT_SELECT_SUBORDINATE_TRADE'] ||
      userRights['ACCOUNT_SELECT_WILD_TRADE'] ||
      userRights['ACCOUNT_SELECT_ALL_TRADE'];
    this.hasAccoutRight = hasAccoutRight;
    this.hasCustomerRight = hasCustomerRight;
    this.state = {
      chartDataReady: false,
      rankType: hasAccoutRight ? 'account' : hasCustomerRight ? 'customer' : ''
    };
  }
  getChartTypes(type) {
    const { rankType } = this.state;
    let endType = type ? type : rankType;
    if (endType === 'customer') {
      return customerRankParams;
    }
    if (endType === 'account') {
      return accountRankParams;
    }
  }
  componentDidMount() {
    const {
      userRights,
      initialParams,
      searchParams,
      getCustomerRankings,
      setDashboardViewRight
    } = this.props;
    const type = this.getChartTypes();
    setDashboardViewRight(userRights);
    initialParams(type);
    this.requestRanking({ ...searchParams, type });
  }
  componentWillUnmount() {
    this.props.resetData();
  }

  requestRanking(params, type) {
    const { getCustomerRankings, getAccountRankings } = this.props;
    const { rankType } = this.state;
    let endType = type ? type : rankType;
    if (endType === 'customer') {
      params.type = customerRankParams;
      getCustomerRankings(params);
      return;
    }
    if (endType === 'account') {
      params.type = accountRankParams;
      getAccountRankings(params);
      return;
    }
  }

  modifyParams(field, value) {
    const { modifyParams, searchParams } = this.props;
    let obj;
    if (field === 'date') {
      obj = {
        fromTime: value.start,
        toTime: value.end
      };
    } else {
      obj = { [field]: value };
    }
    const params = {
      ...searchParams,
      ...obj
    };
    modifyParams(params);
    this.requestRanking(params);
  }

  typeOnChange(type) {
    const { searchParams } = this.props;
    const { rankType } = this.state;
    if (type === rankType) return;
    this.setState({
      rankType: type
    });
    this.requestRanking(
      { ...searchParams, type: this.getChartTypes(type) },
      type
    );
  }

  render() {
    const {
      match: { url },
      userRights,
      customerRankings,
      accountRankings,
      searchParams,
      dashboardViewRight
    } = this.props;
    const hasCustomerRight = this.hasCustomerRight;
    const hasAccoutRight = this.hasAccoutRight;

    if (!hasCustomerRight && !hasAccoutRight) return <NoPermissionView />;

    const { rankType } = this.state;
    const order = this.getChartTypes();
    const keys = [];
    order.forEach(key => {
      if (rankType === 'account' && !accountRankings[key]) {
        return;
      }
      if (rankType === 'customer' && !customerRankings[key]) {
        return;
      }
      if (rankType === 'customer' && hasCustomerRight) {
        keys.push(key);
      }
      if (rankType === 'account' && hasAccoutRight) {
        keys.push(key);
      }
    });

    return (
      <div className={cs['container']}>
        <div className={cs['navigation-bar']}>
          <div className={cs['navigation-left']}>
            <span className={cs['panel-title']}>
              {i18n['dashboard.navigator.customer_data.customer_rankings']}
            </span>
          </div>
          <div className={rcs['rank-switch-container']}>
            {hasCustomerRight ? (
              <a
                href="javascript:;"
                data-test="customer"
                onClick={this.typeOnChange.bind(this, 'customer')}
                className={`rank-switch ${rcs['rank-switch']} ${
                  rankType === 'customer' ? 'active' : ''
                }`}
              >
                {i18n['dashboard.rank_type.customer']}
              </a>
            ) : null}
            {hasAccoutRight ? (
              <a
                href="javascript:;"
                data-test="account"
                onClick={this.typeOnChange.bind(this, 'account')}
                className={`rank-switch ${rcs['rank-switch']} ${
                  rankType === 'account' ? 'active' : ''
                }`}
              >
                {i18n['dashboard.rank_type.account']}
              </a>
            ) : null}
          </div>
          <AddToWorkbench
            options={
              rankType !== 'account' ? customerRankParams : accountRankParams
            }
          />
          <DateRangePicker
            align="right"
            onChange={this.modifyParams.bind(this, 'date')}
            defaultDate={{
              start: searchParams.fromTime,
              end: searchParams.toTime
            }}
            defaultLabel={i18n['general.date_range_picker.option.last7days']}
          />
        </div>
        <div className={rcs['table-container']}>
          {keys.map((key, index) => {
            return (
              <div key={index} className={rcs['table-item']}>
                <PagePanel>
                  <PagePanel.Header>
                    {i18n[`dashboard.data_type.${key}`]}
                  </PagePanel.Header>
                  <PagePanel.Body className={rcs['panel-body']}>
                    {rankType === 'customer' ? (
                      <CustomerChart data={customerRankings[key]} type={key} />
                    ) : null}
                    {rankType === 'account' ? (
                      <Chart data={accountRankings[key]} type={key} />
                    ) : null}
                  </PagePanel.Body>
                </PagePanel>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
