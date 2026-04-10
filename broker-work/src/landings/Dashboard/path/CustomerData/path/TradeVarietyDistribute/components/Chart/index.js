import Bar from 'components/Charts/Bar';
import i18n from 'utils/i18n';
import cs from './Chart.less';

export default class Chart extends Component {
  render() {
    const { data = [] } = this.props;
    const showData = [
      { data: data.reverse(), name: i18n['dashboard.chart.name.times'] }
    ];
    const labels = data.map(val => val.key);

    return (
      <div className={cs['container']}>
        <div className={cs['chart']}>
          <div className={cs['chart-wraper']}>
            <Bar horizontal data={showData} labels={labels} />
          </div>
        </div>
      </div>
    );
  }
}
