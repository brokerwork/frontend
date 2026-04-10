import Pie from 'components/Charts/Pie';
import cs from './DepositDistribute.less';

export default class DepositDistribute extends PureComponent {
  render() {
    const { data = [], labels = [], dashboardItemKey } = this.props;

    return (
      <div className={cs['container']}>
        <div className={cs['chart']}>
          <div className={cs['chart-wraper']}>
            <Pie data={data} labels={labels} showLegend={!dashboardItemKey} />
          </div>
        </div>
      </div>
    );
  }
}
