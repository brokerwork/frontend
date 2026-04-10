import cs from '../Charts.less';
import Wraper from '../Wraper';
import '../themes/funnelLwork.js';

export default class Pie extends PureComponent {
  render() {
    const { id, ...props } = this.props;
    const option = this.createOption(props);
    return <Wraper id={id} option={option} theme="funnelLwork" />;
  }
  createOption = ({ title = '', yFormater, labels = [], data = [] }) => {
    const dataType = [
      {
        type: 'funnel',
        data: data,
        left: '10%',
        top: 60,
        //x2: 80,
        bottom: 60,
        width: '80%',
        // height: {totalHeight} - y - y2,
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          normal: {
            show: true,
            position: 'right'
          },
          emphasis: {
            textStyle: {
              fontSize: 20
            }
          }
        },
        labelLine: {
          normal: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          }
        },
        itemStyle: {
          normal: {
            borderColor: '#fff',
            borderWidth: 1
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
        data: labels,
        bottom: 10
      },
      series: dataType
    };

    return config;
  };
}
