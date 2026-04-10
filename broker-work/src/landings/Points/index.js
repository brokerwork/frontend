import { connect } from 'react-redux';
import * as actions from 'commonActions/actions';
import cs from './index.less';

class Points extends PureComponent {
  componentDidMount() {
    this.props.id && this.props.fetchPoints(this.props.id);
    this.props.fetchPointsFields();
  }
  render() {
    const pointsInfo = this.props.info || this.props.points;
    const points = [];
    for (let i in pointsInfo) {
      if (i.indexOf('points') !== -1 && this.props.pointsMap[i]) {
        points.push({
          key: i,
          value: pointsInfo[i] || '--',
          orderNo: this.props.pointsMap[i].orderNo
        });
      }
    }
    if (!points.length) return null;
    return (
      <ul style={this.props.style} className={cs.list}>
        {points.sort((a, b) => a.orderNo - b.orderNo).map(el => {
          return (
            <li>
              <p>{this.props.pointsMap[el.key].label}</p>
              {el.value}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default connect(
  ({ common }) => ({
    points: common.points,
    pointsMap: common.pointsMap
  }),
  {
    ...actions
  }
)(Points);
