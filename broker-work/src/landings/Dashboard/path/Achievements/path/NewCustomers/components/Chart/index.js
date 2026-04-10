import Line from 'components/Charts/Line';
import i18n from 'utils/i18n';
import cs from './Chart.less';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    const { data, rights, dashboardItemKey } = props;
    let initialKey;
    if (dashboardItemKey) {
      initialKey = dashboardItemKey;
    } else {
      if (rights['checkCustomer']) {
        initialKey = 'NEW_CUSTOMER_PAGE';
      } else if (rights['checkAccount']) {
        initialKey = 'NEW_ACCOUNT_PAGE';
      }
    }
    this.state = {
      userRightReady: !!initialKey,
      activeData: initialKey,
      data: this.getCurrentData(initialKey, props)
    };
  }
  componentWillReceiveProps(nextProps) {
    const { activeData } = this.state;
    this.setState({
      data: this.getCurrentData(activeData, nextProps)
    });
  }
  getCurrentData = (activeDataKey, props) => {
    const { data = [] } = props;
    const currentData = data.map(item => {
      return item[activeDataKey];
    });
    return [
      {
        name: i18n[`dashboard.data_type.${activeDataKey}`],
        data: currentData
      }
    ];
  };
  changeActiveData = activeData => {
    const data = this.getCurrentData(activeData, this.props);
    this.setState({ activeData, data });
  };
  render() {
    const { labels, rights, dashboardItemKey } = this.props;
    const { data, activeData, userRightReady } = this.state;
    if (!userRightReady) return null;
    return (
      <div className={cs['container']}>
        {dashboardItemKey ? null : (
          <ul
            className={`nav nav-tabs ${cs['nav']}`}
            style={{ display: 'flex' }}
          >
            {rights['checkCustomer'] && (
              <li
                className={
                  activeData === 'NEW_CUSTOMER_PAGE' ? 'active' : undefined
                }
                onClick={this.changeActiveData.bind(this, 'NEW_CUSTOMER_PAGE')}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.NEW_CUSTOMER_PAGE']}
                </a>
              </li>
            )}
            {rights['checkCustomer'] && (
              <li
                className={
                  activeData === 'NEW_CUSTOMER_HAS_DEPOSIT_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'NEW_CUSTOMER_HAS_DEPOSIT_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.NEW_CUSTOMER_HAS_DEPOSIT_PAGE']}
                </a>
              </li>
            )}
            {rights['checkCustomer'] && (
              <li
                className={
                  activeData === 'NEW_CUSTOMER_HAS_DEAL_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'NEW_CUSTOMER_HAS_DEAL_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.NEW_CUSTOMER_HAS_DEAL_PAGE']}
                </a>
              </li>
            )}
            {rights['checkAccount'] && (
              <li
                className={
                  activeData === 'NEW_ACCOUNT_PAGE' ? 'active' : undefined
                }
                onClick={this.changeActiveData.bind(this, 'NEW_ACCOUNT_PAGE')}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.NEW_ACCOUNT_PAGE']}
                </a>
              </li>
            )}
            {rights['checkAccount'] && (
              <li
                className={
                  activeData === 'NEW_ACCOUNT_HAS_DEPOSIT_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'NEW_ACCOUNT_HAS_DEPOSIT_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.NEW_ACCOUNT_HAS_DEPOSIT_PAGE']}
                </a>
              </li>
            )}
            {rights['checkAccount'] && (
              <li
                className={
                  activeData === 'NEW_ACCOUNT_HAS_DEAL_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'NEW_ACCOUNT_HAS_DEAL_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.NEW_ACCOUNT_HAS_DEAL_PAGE']}
                </a>
              </li>
            )}
          </ul>
        )}
        <div className={cs['chart']}>
          <div className={cs['chart-wraper']}>
            <Line data={data} labels={labels} />
          </div>
        </div>
      </div>
    );
  }
}
