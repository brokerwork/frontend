import cs from '../Charts.less';
import Wraper from '../Wraper';

export default class Pie extends PureComponent {
  render() {
    const { id, ...props } = this.props;
    const option = this.createOption(props);
    return <Wraper id={id} option={option} />;
  }
  createOption = ({
    title = '',
    yFormater,
    labels = [],
    data = [],
    showLegend = true
  }) => {
    const dataType = [
      {
        type: 'pie',
        data: data,
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            formatter: '{d}%'
            // position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: true
          }
        }
      }
    ];

    const config = {
      title: {
        text: title,
        left: 'center',
        top: 'bottom'
      },
      tooltip: {
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: showLegend,
        data: labels,
        bottom: 10
      },
      series: dataType
    };

    return config;
  };
}
