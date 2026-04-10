import cs from './Checkbox.less';
import cls from 'utils/class';

export default class Checkbox extends PureComponent {
  state = {
    checkboxStatus: false,
    hasCheckedProps: typeof this.props.checked !== 'undefined'
  };
  componentDidMount() {
    if (this.state.hasCheckedProps) return;
    const checkboxEle = this.refs['checkbox-element'];
    this.setState({
      checkboxStatus: checkboxEle.checked
    });
  }

  onChange = evt => {
    const { onChange } = this.props;
    const { hasCheckedProps } = this.state;
    if (onChange) {
      onChange(evt);
    }
    if (!hasCheckedProps) {
      const checkboxEle = this.refs['checkbox-element'];
      this.setState({
        checkboxStatus: checkboxEle.checked
      });
    }
  };

  checkboxIcon = {
    '0': 'fa-checkbox-unchecked2',
    '1': 'fa-checkbox-checked',
    '2': 'fa-checkbox-partial'
  };

  render() {
    const {
      inline,
      className = '',
      checked,
      disabled,
      defaultChecked,
      title
    } = this.props;
    const { checkboxStatus, hasCheckedProps } = this.state;

    let icon = 'fa-square-o';
    const value = hasCheckedProps ? checked : checkboxStatus;
    if (this.checkboxIcon[checked]) {
      icon = this.checkboxIcon[checked];
    } else {
      icon = value ? this.checkboxIcon['1'] : this.checkboxIcon['0'];
    }

    return (
      <label
        className={cls`checkbox ${cs['checkbox']}
              ${inline ? cs['inline'] : ''}
              ${className}`}
        title={title}
        data-test={this.props['data-test']}
      >
        <input
          type="checkbox"
          ref="checkbox-element"
          disabled={disabled}
          defaultChecked={defaultChecked}
          onChange={this.onChange}
          checked={checked}
        />
        <i
          className={cls`fa ${icon}
            ${disabled ? cs['disabled'] : ''}
            ${value ? cs['checked'] : ''}`}
        />
        <span>{this.props.children}</span>
      </label>
    );
  }
}
