import echarts from 'echarts';
import cs from '../Charts.less';
import '../themes/lwork';
import { findDOMNode } from 'react-dom';
import elementResizeEvent from 'element-resize-event';

export default class Wrapers extends PureComponent {
  componentWillUnmount() {
    const container = findDOMNode(this.refs['container']);

    elementResizeEvent.unbind(container.parentNode);
  }
  componentDidMount() {
    const { option, theme } = this.props;
    const container = findDOMNode(this.refs['container']);

    this.setSize();
    this.charts = echarts.init(container, theme || 'lwork');
    this.charts.setOption(option);

    elementResizeEvent(container.parentNode, () => {
      this.setSize();
    });
  }

  setSize = () => {
    const container = findDOMNode(this.refs['container']);
    const containerParent = container.parentNode;
    container.style.height = `${containerParent.offsetHeight}px`;
    container.style.width = `${containerParent.offsetWidth}px`;
    if (this.charts) this.charts.resize();
  };

  componentWillReceiveProps(nextProps) {
    this.charts.clear();
    this.charts.setOption(nextProps.option);
  }

  render() {
    return <div ref="container" className={cs['container']} />;
  }
}
