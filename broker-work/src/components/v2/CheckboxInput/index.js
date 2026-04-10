import { Checkbox } from 'lean-ui';

import cs from './CheckboxInput.less';

export default class CheckboxInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      disabled: !props.checked
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      disabled: !props.checked
    });
  }

  toggle = evt => {
    const { onCheckboxChange } = this.props;

    onCheckboxChange && onCheckboxChange(evt);
  };

  handleLimits(evt) {
    const { limits } = this.props;
    const input = evt.target.value;
    if (limits) {
      if (input > limits.max) {
        evt.target.value = limits.max;
      } else if (input < limits.min) {
        evt.target.value = limits.min;
      }
    }
    return evt;
  }

  onChange = evt => {
    const { onChange } = this.props;
    evt.target.value = evt.target.value.replace(/^0+/, 0);
    onChange && onChange(this.handleLimits(evt));
  };

  render() {
    const { value, checked, className, showPercentUnit } = this.props;
    const { disabled } = this.state;
    return (
      <div className={`${cs['checkbox-input']} ${className}`}>
        <Checkbox
          className={cs['checkbox']}
          checked={checked}
          onChange={this.toggle}
        />
        <input
          type="text"
          className={`form-control ${cs['input-text']}`}
          placeholder="NA"
          value={value}
          disabled={disabled}
          onChange={this.onChange}
        />
        {showPercentUnit && !disabled ? (
          <span className={`${cs['input-unit']}`}>%</span>
        ) : null}
      </div>
    );
  }
}
