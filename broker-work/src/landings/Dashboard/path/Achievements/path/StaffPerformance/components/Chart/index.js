import Bar from 'components/Charts/Bar';
import i18n from 'utils/i18n';
import cs from './Chart.less';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    const { rights, dashboardItemKey } = props;
    let initialKey;
    if (dashboardItemKey) {
      initialKey = dashboardItemKey;
    } else {
      if (rights['checkCustomer']) {
        initialKey = 'USER_RANK_NEW_CUSTOMER_PAGE';
      } else if (rights['accountTrade']) {
        initialKey = 'USER_RANK_NEW_ACCOUNT_PAGE';
      } else if (rights['commission']) {
        initialKey = 'USER_RANK_NEW_COMMISSION_PAGE';
      }
    }
    const obj = this.getCurrentData(initialKey, props);
    this.state = {
      userRightReady: !!initialKey,
      ...obj,
      activeData: initialKey
    };
  }
  componentWillReceiveProps(nextProps) {
    const { activeData } = this.state;
    const obj = this.getCurrentData(activeData, nextProps);
    this.setState(obj);
  }
  getCurrentData = (activeDataKey, props) => {
    const { data = [], labels = [] } = props;
    let d = data.map((v, index) => ({
      value: v[activeDataKey],
      name: labels[index]
    }));

    const sortData = d.sort((a, b) => {
      return b.value - a.value;
    });

    if (sortData.length > 10) {
      sortData.length = 10;
    }
    // Bar 使用 horizontal 属性，需要反转数组才能从上至下正确显示排列顺序
    sortData.reverse();
    const label = sortData.map(item => {
      return item.name;
    });

    const currentData = [
      {
        name: i18n[`dashboard.data_type.${activeDataKey}`],
        data: sortData
      }
    ];
    return { data: currentData, labels: label };
  };
  changeActiveData = activeData => {
    const data = this.getCurrentData(activeData, this.props);
    this.setState({ activeData, ...data });
  };
  render() {
    const { data, activeData, labels, userRightReady } = this.state;
    const { rights, dashboardItemKey } = this.props;
    if (!userRightReady) return null;
    return (
      <div className={cs['container']}>
        {dashboardItemKey ? null : (
          <ul className="nav nav-tabs">
            {rights['checkCustomer'] && (
              <li
                className={
                  activeData === 'USER_RANK_NEW_CUSTOMER_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'USER_RANK_NEW_CUSTOMER_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.USER_RANK_NEW_CUSTOMER_PAGE']}
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'USER_RANK_NEW_ACCOUNT_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'USER_RANK_NEW_ACCOUNT_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.USER_RANK_NEW_ACCOUNT_PAGE']}
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'USER_RANK_NEW_DEPOSIT_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'USER_RANK_NEW_DEPOSIT_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.USER_RANK_NEW_DEPOSIT_PAGE']}
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'USER_RANK_NEW_WITHDRAWAL_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'USER_RANK_NEW_WITHDRAWAL_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.USER_RANK_NEW_WITHDRAWAL_PAGE']}
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'USER_RANK_NEW_NET_DEPOSIT_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'USER_RANK_NEW_NET_DEPOSIT_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.USER_RANK_NEW_NET_DEPOSIT_PAGE']}
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'USER_RANK_NEW_DEAL_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'USER_RANK_NEW_DEAL_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.USER_RANK_NEW_DEAL_PAGE']}
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'USER_RANK_NEW_PROFIT_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'USER_RANK_NEW_PROFIT_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.USER_RANK_NEW_PROFIT_PAGE']}
                </a>
              </li>
            )}
            {rights['commission'] && (
              <li
                className={
                  activeData === 'USER_RANK_NEW_COMMISSION_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'USER_RANK_NEW_COMMISSION_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.USER_RANK_NEW_COMMISSION_PAGE']}
                </a>
              </li>
            )}
            {rights['checkCustomer'] && (
              <li
                className={
                  activeData === 'USER_RANK_NEW_DEPOSIT_CUSTOMER_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'USER_RANK_NEW_DEPOSIT_CUSTOMER_PAGE'
                )}
              >
                <a href="javascript:;">
                  {
                    i18n[
                      'dashboard.table_header.USER_RANK_NEW_DEPOSIT_CUSTOMER_PAGE'
                    ]
                  }
                </a>
              </li>
            )}
          </ul>
        )}
        <div className={cs['chart']}>
          <div className={cs['chart-wraper']}>
            <Bar data={data} horizontal labels={labels} />
          </div>
        </div>
      </div>
    );
  }
}
