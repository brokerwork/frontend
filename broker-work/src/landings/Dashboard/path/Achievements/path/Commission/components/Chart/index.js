import Line from 'components/Charts/Line';
import i18n from 'utils/i18n';
import cs from './Chart.less';

const Chart = ({ labels, data }) => {
  const chartData = [
    {
      name: i18n['dashboard.title.commission'],
      data: data.map(item => item['COMMISSION_PANEL'])
    }
  ];

  return (
    <div className={cs['container']}>
      <div className={cs['chart']}>
        <Line data={chartData} labels={labels} />
      </div>
    </div>
  );
};
export default Chart;
