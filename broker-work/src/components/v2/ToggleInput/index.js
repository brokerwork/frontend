import { Input, Icon, Button } from 'lean-ui';
import cs from './index.less';
import NumberInput from 'components/v2/NumberInput';
import i18n from 'utils/i18n';
export default class ToggleInput extends Component {
  state = {
    focus: false,
    inputValue: this.props.value,
    foucsValue: ''
  };
  componentDidMount() {
    const { bindBlur } = this.props;
    if (bindBlur) {
      bindBlur(() => {
        this.setState({
          focus: false
        });
      });
    }
    this.fetchInputValue(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.inputValue) {
      this.fetchInputValue(nextProps);
    }
  }
  fetchInputValue = props => {
    const { value } = props;
    this.setState({
      inputValue: value
    });
  };
  onFocus = () => {
    const { disabled } = this.props;
    const { inputValue } = this.state;
    if (disabled) return;
    this.setState({
      focus: true,
      foucsValue: inputValue
    });
  };
  onInputChange = e => {
    const inputValue = e.target.value;
    this.onChange(inputValue);
  };
  onChange = inputValue => {
    const { onInput } = this.props;
    this.setState(
      {
        inputValue
      },
      () => {
        if (onInput) {
          onInput(inputValue);
        }
      }
    );
  };
  onBlur = () => {
    const { onChange, value, cancelButton, confirmButton } = this.props;
    const { inputValue } = this.state;
    if (cancelButton || confirmButton) {
      return;
    }
    this.setState(
      {
        focus: false
      },
      () => {
        if (onChange) {
          onChange(inputValue);
        }
      }
    );
  };
  onCancel = () => {
    const { foucsValue } = this.state;
    this.setState(
      {
        focus: false
      },
      () => {
        this.onChange(foucsValue);
      }
    );
  };

  onKeyUp = e => {
    if (e.keyCode !== 13) return;
    const { onChange, value, cancelButton, confirmButton } = this.props;
    if (cancelButton || confirmButton) {
      return;
    }
    const { inputValue } = this.state;
    this.setState(
      {
        focus: false
      },
      () => {
        if (onChange) {
          if (inputValue === value) return;
          onChange(inputValue);
        }
      }
    );
  };
  onConfirm = () => {
    const { onChange } = this.props;
    const { inputValue } = this.state;
    this.setState(
      {
        focus: false
      },
      () => {
        if (onChange) {
          onChange(inputValue);
        }
      }
    );
  };
  renderComponent = () => {
    const {
      icon = 'edit',
      value,
      disabled,
      error,
      inline,
      className,
      inputClassName,
      staticIcon,
      inputType = 'input',
      onChange,
      ...typeAttr
    } = this.props;
    const { inputValue } = this.state;
    const classStr = `${inputClassName} ${cs['input']} ${
      error ? cs['error'] : ''
    }`;
    switch (inputType) {
      case 'number':
        return (
          <NumberInput
            {...typeAttr}
            className={classStr}
            value={inputValue}
            onChange={this.onChange}
            onBlur={this.onBlur}
            disabled={disabled}
          />
        );
      case 'input':
      default:
        return (
          <Input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onInputChange}
            onKeyUp={this.onKeyUp}
            value={inputValue}
            type="text"
            className={classStr}
            disabled={disabled}
          />
        );
    }
  };
  render() {
    const {
      icon = 'edit',
      value,
      disabled,
      error,
      inline,
      className,
      inputClassName,
      staticIcon,
      inputType = 'input',
      cancelButton,
      confirmButton
    } = this.props;
    const { focus, inputValue } = this.state;
    const cancelButtonText = cancelButton
      ? cancelButton === true
        ? i18n['general.cancel']
        : cancelButton
      : undefined;
    return (
      <label
        className={`${cs['toggle-input-box']} ${inline ? cs['inline'] : ''} ${
          staticIcon ? cs['static-icon'] : ''
        } ${className}`}
      >
        {focus ? (
          <span className={cs['input-group']} data-test="input-group">
            {this.renderComponent()}
            {cancelButton ? (
              <span className={cs['button-bar']}>
                <span className={cs['button']} onClick={this.onCancel}>
                  {cancelButtonText}
                </span>
              </span>
            ) : (
              undefined
            )}
            {confirmButton ? (
              <Button type="primary" onClick={this.onConfirm}>
                {i18n['general.save']}
              </Button>
            ) : (
              undefined
            )}
          </span>
        ) : (
          <span onClick={this.onFocus} data-test="label-group">
            <span className={cs['fake-input']}>{value}</span>
            {disabled ? undefined : <Icon icon={icon} />}
          </span>
        )}
      </label>
    );
  }
}
