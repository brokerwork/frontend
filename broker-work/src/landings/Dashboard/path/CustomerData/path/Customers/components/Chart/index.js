import LineAndBar from 'components/Charts/LineAndBar';
import i18n from 'utils/i18n';
import cs from './Chart.less';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    const { activeTab, dashboardItemKey } = props;
    let initialKey;
    if (dashboardItemKey) {
      initialKey = dashboardItemKey;
    } else {
      initialKey = activeTab;
    }
    const state = {
      activeData: initialKey
    };
    state['data'] = this.getCurrentData(props, state);
    this.state = state;
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: this.getCurrentData(nextProps, this.state)
    });
  }

  getCurrentData = (props, state) => {
    const { labels = [], data = [] } = props.dashboardItemKey
      ? props
      : props.data;
    const { activeData } = state;
    const barData = [];
    const lineData = [];
    labels.forEach((label, index) => {
      const bar = data[index][activeData];
      const line = data[index][`${activeData}_RATE`];
      barData.push(bar);
      lineData.push(Math.floor(line * 10000) / 100);
    });
    return [
      {
        name: i18n['dashboard.number'],
        type: 'bar',
        data: barData
      },
      {
        name: i18n['dashboard.total_proportion'],
        type: 'line',
        data: lineData
      }
    ];
  };
  modifyParams(activeData) {
    const data = this.getCurrentData(this.props, { activeData });
    this.setState({ data, activeData });
  }
  render() {
    const { labels = {} } = this.props.data || { labels: {} };
    const { tabs, dashboardItemKey } = this.props;
    const { data, activeData } = this.state;

    return (
      <div className={cs['container']}>
        {dashboardItemKey ? null : (
          <ul className={`nav nav-tabs ${cs['nav']}`}>
            {tabs.map(tab => (
              <li
                key={tab.value}
                className={activeData === tab.value ? 'active' : null}
                onClick={this.modifyParams.bind(this, tab.value)}
              >
                <a href="javascript:;">{tab.label}</a>
              </li>
            ))}
          </ul>
        )}
        <div className={cs['chart']}>
          <div className={cs['chart-wraper']}>
            <LineAndBar
              data={data}
              labels={labels}
              lineYFormater={'{value} %'}
            />
          </div>
        </div>
      </div>
    );
  }
}
