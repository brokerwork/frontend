import Line from 'components/Charts/Line';
import DropdownForCode from 'components/v2/DropdownForCode';
import Pie from 'components/Charts/Pie';
import Pills from 'components/Pills';
import i18n from 'utils/i18n';
import cs from './Chart.less';
import { Select, Radio, Button } from 'lean-ui';

const topNumberList = [
  { value: 5, label: 'top5' },
  { value: 10, label: 'top10' },
  { value: 20, label: 'top20' }
];

export default class Chart extends Component {
  constructor(props) {
    super(props);
    const {
      rights,
      dashboardItem,
      dashboardItemKey,
      activeChartType
    } = this.props;
    let activeData;
    let activeChart = activeChartType;
    if (dashboardItemKey) {
      activeChart = dashboardItem.type;
      activeData = dashboardItem.activeData;
    } else {
      if (rights['checkCustomer']) {
        activeData = 'NEW_CUSTOMER_PAGE';
      } else if (rights['accountTrade']) {
        activeData = 'NEW_ACCOUNT_PAGE';
      }
    }
    const state = {
      initialRight: !!activeData,
      activeData,
      activeChart,
      topNumber: 5
    };
    state['chartData'] = this.getCurrentData(props, state);
    this.state = state;
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      chartData: this.getCurrentData(nextProps, this.state)
    });
  }
  modifyParams(field, data) {
    const { onChartViewChange } = this.props;
    const state = {
      ...this.state,
      [field]: data
    };
    onChartViewChange(state.activeChart);
    state['chartData'] = this.getCurrentData(this.props, state);
    this.setState(state);
  }

  getCurrentData = (props, state) => {
    const {
      historyData,
      rankingsData,
      activeFilter,
      customerSourceOptions
    } = props;
    const { activeChart, activeData, topNumber } = state;
    const activeDataKey = `SOURCE_${
      activeChart === 'line' ? 'TREND' : 'DISTRIBUTE'
    }_${activeData}`;
    const customerSourceObj = {};
    customerSourceOptions.forEach(item => {
      customerSourceObj[item.value] = item.label;
    });
    if (activeChart === 'line') {
      let d = [];
      const activeFilterData = historyData[activeFilter];
      if (activeFilterData && activeFilterData['data']) {
        d = activeFilterData['data'].map(item => {
          return item[activeDataKey];
        });
        return {
          labels: activeFilterData['labels'],
          data: [
            {
              name: i18n[`dashboard.data_type.${activeDataKey}`],
              data: d
            }
          ]
        };
      } else {
        return { labels: [], data: [] };
      }
    } else {
      let { labels, data } = rankingsData;
      const allIndex = labels.findIndex(item => item === 'all');
      let d = labels.map((item, index) => {
        return {
          value: data[index][activeDataKey],
          name: customerSourceObj[item]
        };
      });
      if (allIndex >= 0) {
        d.splice(allIndex, 1);
      }
      d.sort((a, b) => {
        return b.value - a.value;
      });
      const topData = d.slice(0, topNumber - 1);
      const otherData = d.slice(topNumber - 1);
      let otherDataSum = 0;
      if (otherData.length > 0) {
        otherDataSum = otherData.reduce((sum, item) => {
          if (sum.value) {
            return sum.value + item.value;
          } else {
            return sum + item.value;
          }
        });
      }
      topData.push({
        value: otherDataSum,
        name: i18n['dashboard.other']
      });

      const l = topData.map(item => {
        return item.name;
      });

      return { labels: l, data: topData };
    }
  };
  render() {
    const {
      chartData: { labels, data },
      topNumber,
      activeData,
      activeChart,
      initialRight
    } = this.state;
    const { rights, dashboardItemKey } = this.props;
    if (!initialRight) return null;
    return (
      <div className={cs['container']}>
        {dashboardItemKey ? null : (
          <ul className={`nav nav-tabs ${cs['nav']}`}>
            {rights['checkCustomer'] && (
              <li
                className={
                  activeData === 'NEW_CUSTOMER_PAGE' ? 'active' : undefined
                }
                onClick={this.modifyParams.bind(
                  this,
                  'activeData',
                  'NEW_CUSTOMER_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.SOURCE_TREND_NEW_CUSTOMER_PAGE']}
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
                onClick={this.modifyParams.bind(
                  this,
                  'activeData',
                  'NEW_CUSTOMER_HAS_DEPOSIT_PAGE'
                )}
              >
                <a href="javascript:;">
                  {
                    i18n[
                      'dashboard.data_type.SOURCE_TREND_NEW_CUSTOMER_HAS_DEPOSIT_PAGE'
                    ]
                  }
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
                onClick={this.modifyParams.bind(
                  this,
                  'activeData',
                  'NEW_CUSTOMER_HAS_DEAL_PAGE'
                )}
              >
                <a href="javascript:;">
                  {
                    i18n[
                      'dashboard.data_type.SOURCE_TREND_NEW_CUSTOMER_HAS_DEAL_PAGE'
                    ]
                  }
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'NEW_ACCOUNT_PAGE' ? 'active' : undefined
                }
                onClick={this.modifyParams.bind(
                  this,
                  'activeData',
                  'NEW_ACCOUNT_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.SOURCE_TREND_NEW_ACCOUNT_PAGE']}
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'NEW_ACCOUNT_HAS_DEPOSIT_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.modifyParams.bind(
                  this,
                  'activeData',
                  'NEW_ACCOUNT_HAS_DEPOSIT_PAGE'
                )}
              >
                <a href="javascript:;">
                  {
                    i18n[
                      'dashboard.data_type.SOURCE_TREND_NEW_ACCOUNT_HAS_DEPOSIT_PAGE'
                    ]
                  }
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'NEW_ACCOUNT_HAS_DEAL_PAGE'
                    ? 'active'
                    : undefined
                }
                onClick={this.modifyParams.bind(
                  this,
                  'activeData',
                  'NEW_ACCOUNT_HAS_DEAL_PAGE'
                )}
              >
                <a href="javascript:;">
                  {
                    i18n[
                      'dashboard.data_type.SOURCE_TREND_NEW_ACCOUNT_HAS_DEAL_PAGE'
                    ]
                  }
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'NEW_DEPOSIT_PAGE' ? 'active' : undefined
                }
                onClick={this.modifyParams.bind(
                  this,
                  'activeData',
                  'NEW_DEPOSIT_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.SOURCE_TREND_NEW_DEPOSIT_PAGE']}
                </a>
              </li>
            )}
            {rights['accountTrade'] && (
              <li
                className={
                  activeData === 'NEW_DEAL_PAGE' ? 'active' : undefined
                }
                onClick={this.modifyParams.bind(
                  this,
                  'activeData',
                  'NEW_DEAL_PAGE'
                )}
              >
                <a href="javascript:;">
                  {i18n['dashboard.data_type.SOURCE_TREND_NEW_DEAL_PAGE']}
                </a>
              </li>
            )}
          </ul>
        )}
        {dashboardItemKey ? null : (
          <div className={cs['active-chart']}>
            {activeChart === 'pie' && (
              <Select
                value={topNumber}
                onSelect={this.modifyParams.bind(this, 'topNumber')}
              >
                {topNumberList.map(n => (
                  <Select.Option value={n.value} key={n.value}>
                    {n.label}
                  </Select.Option>
                ))}
              </Select>
            )}
            <Radio.Group
              type="button"
              value={activeChart}
              className={cs['pills']}
              onChange={this.modifyParams.bind(this, 'activeChart')}
            >
              <Radio value="line">
                <i className="fa fa-line-chart" />
                {i18n['dashboard.data_type.trend']}
              </Radio>
              <Radio value="pie">
                <i className="fa fa-pie-chart" />
                {i18n['dashboard.data_type.distribution']}
              </Radio>
            </Radio.Group>
          </div>
        )}
        <div className={cs['chart']}>
          <div className={cs['chart-wraper']}>
            {activeChart === 'line' ? (
              <Line data={data} labels={labels} />
            ) : (
              <Pie data={data} labels={labels} showLegend={!dashboardItemKey} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
