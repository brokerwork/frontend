import Line from 'components/Charts/Line';
import NegativeLineBar from 'components/Charts/NegativeLineBar';
import i18n from 'utils/i18n';
import cs from './Chart.less';

// NEW_DEPOSIT_PAGE, 入金
// NEW_WITHDRAWAL_PAGE, 出金
// NEW_NET_DEPOSIT_PAGE,  净入金
// NEW_DEAL_PAGE, 交易手数

export default class Chart extends Component {
  constructor(props) {
    super(props);
    let initialKey = [];
    const { data, rights, dashboardItemKey } = props;
    const DEPOSIT_MONEY_TREND = [
      'NEW_DEPOSIT_PAGE',
      'NEW_WITHDRAWAL_PAGE',
      'NEW_NET_DEPOSIT_PAGE'
    ];
    const NEW_DEAL_PAGE = ['NEW_DEAL_PAGE'];
    if (dashboardItemKey) {
      if (dashboardItemKey === 'DEPOSIT_MONEY_TREND') {
        initialKey = DEPOSIT_MONEY_TREND;
      }
      if (dashboardItemKey === 'NEW_DEAL_PAGE') {
        initialKey = NEW_DEAL_PAGE;
      }
    } else {
      initialKey = DEPOSIT_MONEY_TREND;
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
    const activeKeyStr = activeDataKey.join(',');
    if (
      activeKeyStr ===
      'NEW_DEPOSIT_PAGE,NEW_WITHDRAWAL_PAGE,NEW_NET_DEPOSIT_PAGE'
    ) {
      const barKey = ['NEW_DEPOSIT_PAGE', 'NEW_WITHDRAWAL_PAGE'];
      const lineKey = ['NEW_NET_DEPOSIT_PAGE'];
      const currentData = activeDataKey.map(key => {
        return {
          type: barKey.includes(key) ? 'bar' : 'line',
          name: i18n[`dashboard.data_type.${key}`],
          data: data.map(item => {
            return item[key];
          })
        };
      });
      return currentData;
    }

    const currentData = activeDataKey.map(key => {
      return {
        name: i18n[`dashboard.data_type.${key}`],
        data: data.map(item => {
          return item[key];
        })
      };
    });
    return currentData;
  };
  changeActiveData = activeData => {
    const data = this.getCurrentData(activeData, this.props);
    this.setState({ activeData, data });
  };
  render() {
    const { labels, userRights, dashboardItemKey } = this.props;
    const { data, activeData } = this.state;
    const activeDataKey = activeData.join(',');

    return (
      <div className={cs['container']}>
        {dashboardItemKey ? null : (
          <ul className="nav nav-tabs">
            <li
              className={
                activeDataKey ===
                'NEW_DEPOSIT_PAGE,NEW_WITHDRAWAL_PAGE,NEW_NET_DEPOSIT_PAGE'
                  ? 'active'
                  : undefined
              }
              onClick={this.changeActiveData.bind(this, [
                'NEW_DEPOSIT_PAGE',
                'NEW_WITHDRAWAL_PAGE',
                'NEW_NET_DEPOSIT_PAGE'
              ])}
            >
              <a href="javascript:;">{i18n['dashboard.data_type.money']}</a>
            </li>
            <li
              className={
                activeDataKey === 'NEW_DEAL_PAGE' ? 'active' : undefined
              }
              onClick={this.changeActiveData.bind(this, ['NEW_DEAL_PAGE'])}
            >
              <a href="javascript:;">
                {i18n['dashboard.data_type.NEW_DEAL_PAGE']}
              </a>
            </li>
          </ul>
        )}
        <div className={cs['chart']}>
          <div className={cs['chart-wraper']}>
            {activeDataKey === 'NEW_DEAL_PAGE' ? (
              <Line data-test="line" data={data} labels={labels} />
            ) : null}
            {activeDataKey ===
            'NEW_DEPOSIT_PAGE,NEW_WITHDRAWAL_PAGE,NEW_NET_DEPOSIT_PAGE' ? (
              <NegativeLineBar
                data-test="negative-line-bar"
                data={data}
                labels={labels}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
