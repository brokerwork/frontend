import cs from "./CircleProgress.less";

export default class CircleProgress extends PureComponent {
  getStrokeDasharray = diameter => {
    const { value = 0 } = this.props;
    const perimeter = Math.PI * 2 * (diameter / 2 - 2);

    return `${perimeter * value} ${perimeter * (1 - value)}`;
  };

  render() {
    const { children, diameter = 150, color = "#00A5E0" } = this.props;
    const strokeDasharray = this.getStrokeDasharray(diameter);

    return (
      <div className={cs["circle-progress"]}>
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
        >
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={diameter / 2 - 2}
            strokeWidth="2"
            stroke="#ffffff"
            fill="none"
          />
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={diameter / 2 - 2}
            strokeWidth="2"
            stroke={color}
            fill="none"
            transform={`matrix(0, -1, 1, 0, 0, ${diameter})`}
            strokeDasharray={strokeDasharray}
          />
        </svg>
        <div
          className={cs["inner-circle"]}
          style={{ width: diameter - 30, height: diameter - 30 }}
        >
          {children}
        </div>
      </div>
    );
  }
}
