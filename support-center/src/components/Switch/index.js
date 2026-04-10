import cs from "./Switch.less";

export default class Switch extends PureComponent {
  onChange = evt => {
    const { onChange } = this.props;
    const checked = evt.target.checked;

    if (onChange) onChange(checked);
  };

  render() {
    const {
      className = "",
      checked = false,
      disabled,
      inline = false
    } = this.props;

    return (
      <label
        className={`switch ${cs["switch"]} ${inline ? cs["inline"] : ""} ${
          checked ? cs["active"] : ""
        } ${disabled ? cs["disabled"] : ""} ${className}`}
      >
        <input
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={this.onChange}
        />
        <i className={cs["ball"]} />
      </label>
    );
  }
}
