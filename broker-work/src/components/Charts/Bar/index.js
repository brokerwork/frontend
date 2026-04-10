import cs from '../Charts.less';
import Wraper from '../Wraper';
import i18n from 'utils/i18n';

export default class Bar extends PureComponent {
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
    horizontal = false, // 水平显示
    max = false, // 汽泡显示最大值
    min = false, // 汽泡显示最小值
    average = false // 显示平均值
  }) => {
    // yFormater Y轴label显示格式化
    // '{value} 人'
    //
    // labels 数据结构 需要与data 中的数据一一对应
    // ['周一','周二','周三','周四','周五','周六','周日']
    //
    // data 数据结构
    // [
    //   {name: '邮件营销1', data: [ 120, 10, 70, 700, 200, 10, 80 ]},
    //   {name: '邮件营销2', data: [ 120, 10, 70, 700, 200, 10, 80 ]},
    //   {name: '邮件营销3', data: [ 120, 10, 70, 700, 200, 10, 80 ]},
    //   {name: '邮件营销4', data: [ 120, 10, 70, 700, 200, 10, 80 ]},
    //   {name: '邮件营销5', data: [ 120, 10, 70, 700, 200, 10, 80 ]},
    // ]

    const dataType = [];
    const legend = [];

    data.forEach(item => {
      legend.push(item.name);
      const v = {
        ...item,
        type: 'bar'
      };
      if (max || min) {
        v.markPoint = { data: [] };
        if (max)
          v.markPoint['data'].push({
            type: 'max',
            name: i18n['dashboard.data.max']
          });
        if (min)
          v.markPoint['data'].push({
            type: 'min',
            name: i18n['dashboard.data.min']
          });
      }
      if (average) {
        v.markLine = { data: [] };
        v.markLine.data.push({
          type: 'average',
          name: i18n['dashboard.data.average']
        });
      }
      dataType.push(v);
    });

    let xAxis = {
      type: 'category',
      data: labels,
      axisLabel: {
        interval: 0
      }
    };
    let yAxis = {
      type: 'value',
      axisLabel: {
        formatter: yFormater
      },
      offset: 5,
      boundaryGap: [0, 0.01]
    };

    if (horizontal) {
      [xAxis, yAxis] = [yAxis, xAxis];
    }

    const config = {
      title: {
        text: title,
        left: 'center',
        top: 'bottom'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: legend,
        bottom: 0
      },
      grid: {
        top: 20,
        left: '3%',
        right: '3%',
        bottom: 50,
        containLabel: true
      },
      xAxis: xAxis,
      yAxis: yAxis,
      series: dataType
    };

    return config;
  };
}
