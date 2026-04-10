import FormControl from 'components/FormControl';

export default class NumberInput extends PureComponent {
  onChange = evt => {
    const {
      onChange,
      nonDecimal = '+',
      decimal = '+',
      negative = false,
      integer = false // 整数
    } = this.props;
    const regexp = integer
      ? new RegExp(`^${negative ? '(-?)' : ''}((\\d${nonDecimal}))?$`, 'g')
      : new RegExp(`^${negative ? '(-?)' : ''}((\\d${nonDecimal})((?:\\.?)|(?:\\.\\d${decimal})))?$`, 'g');
    const targetValue = evt.target.value;
    const matches = targetValue.match(regexp);

    if (matches) {
      onChange(matches[0] || '');
    }
  };

  onBlur = evt => {
    const { onBlur } = this.props;
    let value = evt.target.value;
    const dotIdx = value.indexOf('.');
    const existDotAtLast = dotIdx !== -1 && dotIdx === value.length - 1;
    const onlyMinus = value === '-';

    if (existDotAtLast) {
      value = value.replace('.', '');
    }

    if (onlyMinus) {
      value = '';
    }

    if (onBlur) {
      onBlur(value);
    }
  };

  render() {
    const { value, maxLength, disabled, max, min, className = '', placeholder } = this.props;

    return (
      <FormControl
        value={value}
        max={max}
        min={min}
        className={className}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    );
  }
}
