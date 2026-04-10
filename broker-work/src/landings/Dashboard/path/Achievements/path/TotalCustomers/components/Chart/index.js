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
        initialKey = 'TOTAL_CUSTOMER_PAGE';
      } else if (rights['checkAccount']) {
        initialKey = 'TOTAL_ACCOUNT_PAGE';
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
    const currentData = [
      {
        name: i18n[`dashboard.data_type.${activeDataKey}`],
        data: data.map(item => item[activeDataKey])
      }
    ];
    return currentData;
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
          <ul className="nav nav-tabs">
            {rights['checkCustomer'] && (
              <li
                className={
                  activeData === 'TOTAL_CUSTOMER_PAGE' ? 'active' : undefined
                }
                onClick={this.changeActiveData.bind(
                  this,
                  'TOTAL_CUSTOMER_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.TOTAL_CUSTOMER_PAGE']}
                </a>
              </li>
            )}
            {rights['checkAccount'] && (
              <li
                className={
                  activeData === 'TOTAL_ACCOUNT_PAGE' ? 'active' : undefined
                }
                onClick={this.changeActiveData.bind(this, 'TOTAL_ACCOUNT_PAGE')}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.TOTAL_ACCOUNT_PAGE']}
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
