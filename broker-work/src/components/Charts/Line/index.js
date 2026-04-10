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
    yFormater,
    toolTipFormatter,
    labels = [],
    data = [],
    area = true,
    max = false, // 汽泡显示最大值
    min = false, // 汽泡显示最小值
    average = false, // 汽泡显示平均值
    showLegend = true
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
    let maxData = 0;

    data.forEach(item => {
      legend.push(item.name);
      item.data.forEach(n => {
        if (n > maxData) maxData = n;
      });
      const v = {
        ...item,
        type: 'line'
      };
      if (area) {
        v['areaStyle'] = { normal: {} };
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
      dataType.push(v);
    });

    maxData = Math.floor(maxData).toString();
    const maxDataLength = maxData.length * 6;

    const config = {
      title: {
        text: title,
        left: 'center',
        top: 'bottom'
      },
      tooltip: {
        trigger: 'axis',
        formatter: toolTipFormatter
      },
      legend: {
        show: showLegend,
        data: legend,
        bottom: 0
      },
      grid: {
        top: 25,
        bottom: showLegend ? 70 : 25,
        left: 35 + maxDataLength,
        right: 35
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        offset: 5,
        data: labels
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: yFormater
        }
      },
      series: dataType
    };

    return config;
  };
}
