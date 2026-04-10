import Line from 'components/Charts/Line';
import i18n from 'utils/i18n';
import cs from './Chart.less';
import moment from 'moment';

const actionsArr = ['CREATE', 'OPEN_ACCOUNT', 'DEPOSIT', 'DEAL'];

export default class Chart extends PureComponent {
  constructor(props) {
    super(props);
    const { data = { detail: {}, trend: {} }, activeSource } = props;
    let trendData = data.trend;
    let trendDetail = data.detail;
    let trendDataforChart = this.countTransToTunel(trendData, actionsArr);
    const leftFunnelData = this.detailDataTrans(trendDetail, actionsArr);
    this.state = {
      activeSource,
      chartData: trendDataforChart,
      leftFunnelData
    };
  }
  componentWillReceiveProps(nextProps) {
    const { data = { detail: {}, trend: {} } } = nextProps;
    let trendData = data.trend;
    let trendDetail = data.detail;
    let trendDataforChart = this.countTransToTunel(trendData, actionsArr);
    const leftFunnelData = this.detailDataTrans(trendDetail, actionsArr);
    this.setState({
      chartData: trendDataforChart,
      leftFunnelData
    });
  }
  timeSort(timeArr) {
    return timeArr.map(time => Number(time)).sort((a, b) => {
      return a - b;
    });
  }
  detailDataTrans(detail, actionsArr) {
    let leftFunnelData = {};
    for (let i in detail) {
      leftFunnelData[i] = {};
      actionsArr.forEach((act, index) => {
        const value = detail[i][act];
        const beforeVal = detail[i][actionsArr[index - 1]];
        const percent = (index === 0
          ? value === 0 ? 0 : detail[i][actionsArr[3]] / value * 100
          : beforeVal === 0 ? 0 : value / beforeVal * 100
        ).toFixed(2);
        leftFunnelData[i][act] = {
          value,
          percent
        };
      });
    }
    return leftFunnelData;
  }
  countTransToTunel(trendData, actionsArr) {
    const trendDataKeys = Object.keys(trendData);
    const trendDataKeys0 = trendDataKeys[0];
    let timeSpot = [];
    let end = {};
    if (trendDataKeys0) {
      const actions0 = actionsArr[0];
      if (actions0) {
        timeSpot = this.timeSort(
          trendData[trendDataKeys0][actions0].map(item => Number(item.key))
        );
      }
    }
    const labels = timeSpot.map(time => moment.unix(time).format('YYYY-MM-DD'));
    trendDataKeys.map(key => {
      const temp = actionsArr.map((act, index) => {
        return timeSpot.map(time => {
          const value = trendData[key][act];
          for (let i = 0, len = value.length; i < len; i++) {
            if (value[i].key === `${time}`) {
              return value[i].value;
            }
          }
        });
      });
      end[key] = {
        labels,
        data: this.matrixTrans(temp)
      };
    });
    return end;
  }
  matrixTrans(matrix) {
    let end = [];
    let transferStr = [
      i18n['dashboard.data_type.fransfer.CREATE'],
      i18n['dashboard.data_type.fransfer.OPEN_ACCOUNT'],
      i18n['dashboard.data_type.fransfer.DEPOSIT'],
      i18n['dashboard.data_type.fransfer.DEAL']
    ];
    matrix.forEach((outer, index) => {
      end.push({
        name: transferStr[index],
        data: outer.map((inner, innerIdx) => {
          if (index === 0) {
            let end =
              inner === 0
                ? 0
                : matrix[matrix.length - 1][innerIdx] / inner * 100;
            return end.toFixed(2);
          }
          const beforeStep = matrix[index - 1][innerIdx];
          let end = beforeStep === 0 ? 0 : inner / beforeStep * 100;
          return end.toFixed(2);
        })
      });
    });
    return end;
  }
  render() {
    const { dashboardItemKey, sources, data = { detail: {} } } = this.props;
    const { chartData, leftFunnelData } = this.state;
    const { activeSource } = this.props;
    const activeChartData = chartData[activeSource];
    const leftData = leftFunnelData[activeSource];
    return (
      <div className={cs['container']}>
        <div className={cs['steps']}>
          <ul>
            {actionsArr.map((act, index) => {
              return (
                <li key={act}>
                  <div
                    className={`${cs['step']} ${index === 0
                      ? cs['first']
                      : ''}`}
                  >
                    {index === 0 ? (
                      <div>{i18n[`dashboard.data_type.fransfer.${act}`]}</div>
                    ) : (
                      ''
                    )}
                    {leftData && leftData[act]
                      ? leftData[act].percent + ' %'
                      : null}
                  </div>
                  <div className={cs['label']}>
                    {i18n[`dashboard.data_type.funnel.${act}`]}
                    <span>{data.detail.all ? data.detail.all[act] : null}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        {dashboardItemKey ? null : (
          <div className={cs['chart']}>
            <div className={cs['chart-wraper']}>
              {chartData ? (
                <Line
                  {...activeChartData}
                  area={false}
                  yFormater="{value} %"
                  toolTipFormatter={`{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%<br />{a3}: {c3}%`}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }
}
