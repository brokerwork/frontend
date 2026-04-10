import Line from 'components/Charts/Line';
import i18n from 'utils/i18n';
import cs from './Chart.less';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    const { data, tabs, dashboardItemKey } = props;
    let initialKey;
    if (dashboardItemKey) {
      initialKey = dashboardItemKey;
    } else {
      initialKey = tabs[0].value;
    }

    this.state = {
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
    if (activeDataKey === 'NEW_CUSTOMER_TENANT_ACTIVE_LOGIN_PAGE') {
      const keys = [
        'NEW_CUSTOMER_TENANT_ACTIVE_LOGIN_PAGE',
        'NEW_CUSTOMER_TENANT_ACTIVE_TW_LOGIN_PAGE',
        'NEW_CUSTOMER_TENANT_ACTIVE_MT4_LOGIN_PAGE',
        'NEW_CUSTOMER_TENANT_ACTIVE_MT5_LOGIN_PAGE',
        'NEW_CUSTOMER_TENANT_ACTIVE_CTRADER_LOGIN_PAGE'
      ];
      return keys.map(k => {
        return {
          name: i18n[`dashboard.data_type.${k}`],
          data: data.map(item => {
            return item[k];
          })
        };
      });
    }
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
    const { labels, tabs, dashboardItemKey } = this.props;
    const { data, activeData } = this.state;
    return (
      <div className={cs['container']} data-test="container">
        {dashboardItemKey ? null : (
          <ul className={`nav nav-tabs ${cs['nav']}`}>
            {tabs.map(tab => (
              <li
                key={tab.value}
                className={activeData === tab.value ? 'active' : ''}
                data-test="nav-item"
                onClick={this.changeActiveData.bind(this, tab.value)}
              >
                <a href="javascript:;">{tab.label}</a>
              </li>
            ))}
          </ul>
        )}
        <div className={cs['chart']}>
          <div className={cs['chart-wraper']}>
            <Line
              showLegend={!dashboardItemKey}
              data={data}
              labels={labels}
              area={activeData !== 'NEW_CUSTOMER_TENANT_ACTIVE_LOGIN_PAGE'}
            />
          </div>
        </div>
      </div>
    );
  }
}
