/*
默认支持primary, warning, error三种颜色的进度条，
支持自定义样式
Create By Daisy
 */

import cs from "./ProgressBar.less";

export default class ProgressBar extends PureComponent {
  render() {
    const { now, type = "primary", className, sm } = this.props;

    return (
      <div className={className ? className : ""}>
        <div
          className={`${cs["background-content"]} ${cs[type]} ${
            sm ? cs["small"] : ""
          }`}
        >
          <span style={{ width: `${now}%` }} />
        </div>
      </div>
    );
  }
}
