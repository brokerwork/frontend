import cs from '../Charts.less';
import Wraper from '../Wraper';
import i18n from 'utils/i18n';

export default class Line extends PureComponent {
  render() {
    const { id, ...props } = this.props;
    const option = this.createOption(props);
    return <Wraper id={id} option={option} />;
  }
  createOption = ({
    title = '',
    lineYFormater,
    barYFormater,
    labels = [],
    data = [],
    max = false, // 汽泡显示最大值
    min = false, // 汽泡显示最小值
    average = false // 汽泡显示平均值
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
    const yAxis = [];
    let maxBarData = 0;
    let maxLineData = 0;

    data.forEach((item, index) => {
      legend.push(item.name);
      if (item.type === 'bar') {
        item.data.forEach(n => {
          if (n > maxBarData) maxBarData = n;
        });
      } else {
        item.data.forEach(n => {
          if (n > maxLineData) maxLineData = n;
        });
      }
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
      dataType.push({
        ...item,
        yAxisIndex: index
      });
      let formatter;
      if (item.type === 'line') {
        formatter = lineYFormater;
      } else if (item.type === 'bar') {
        formatter = barYFormater;
      }
      yAxis.push({
        type: 'value',
        scale: true,
        min: 0,
        boundaryGap: [0.2, 0.2],
        axisLabel: { formatter }
      });
    });

    maxBarData = Math.floor(maxBarData).toString();
    maxLineData = Math.floor(maxLineData).toString();
    const maxBarDataLength = maxBarData.length * 6;
    const maxLineDataLength = maxLineData.length * 6;

    const config = {
      title: {
        text: title,
        left: 'center',
        top: 'bottom'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: legend,
        bottom: 0
      },
      grid: {
        top: 25,
        bottom: 70,
        left: 35 + maxBarDataLength,
        right: 55 + maxLineDataLength
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        offset: 5,
        data: labels
      },
      yAxis,
      series: dataType
    };

    return config;
  };
}
