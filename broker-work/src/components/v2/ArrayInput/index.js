import cs from './index.less';
import { Input, InputNumber } from 'lean-ui';

export default class ArrayInput extends Component {
  state = {
    result: [undefined]
  };
  changeValue = (index, e) => {
    const { result } = this.state;
    const __result = Object.assign([], result);
    __result[index] = e && e.target ? e.target.value : e;
    this.setState(
      {
        result: __result
      },
      this.onChange
    );
  };

  onChange = () => {
    const { onChange, autoUnArray } = this.props;
    const { result } = this.state;
    if (autoUnArray && result.length === 1) {
      onChange(result[0]);
    } else {
      onChange(result);
    }
  };
  componentDidMount() {
    this.initResult(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.count !== nextProps.count) {
      this.initResult(nextProps, true);
    } else {
      this.initResult(nextProps);
    }
  }
  initResult = (props, change) => {
    const { count = 1, value } = props;
    const __value =
      value !== undefined && !Array.isArray(value) ? [value] : value;
    const result = Object.assign(new Array(count).fill(''), __value);
    this.setState(
      {
        result
      },
      change ? this.onChange : undefined
    );
  };
  render() {
    const {
      className,
      disabled,
      type,
      inputClassName,
      split,
      size,
      placeholder
    } = this.props;
    const { result } = this.state;
    return (
      <span
        className={`${className} ${result.length > 1 ? cs['container'] : ''}`}
      >
        {result.map((item = '', idx) => {
          return [
            idx && split ? (
              <span className={cs['split']}>{split}</span>
            ) : (
              undefined
            ),
            type === 'number' ? (
              <InputNumber
                className={`${cs['input']} ${inputClassName}`}
                value={item}
                disabled={disabled}
                size={size}
                placeholder={placeholder}
                onBlur={this.changeValue.bind(this, idx)}
                onChange={this.changeValue.bind(this, idx)}
              />
            ) : (
              <Input
                className={`${cs['input']} ${inputClassName}`}
                value={item}
                size={size}
                disabled={disabled}
                placeholder={placeholder}
                onChange={this.changeValue.bind(this, idx)}
                onBlur={this.changeValue.bind(this, idx)}
              />
            )
          ];
        })}
      </span>
    );
  }
}
