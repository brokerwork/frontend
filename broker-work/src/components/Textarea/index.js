import { FormControl } from 'react-bootstrap';
import cs from './Textarea.less';

export const getStringLength = (value = '') => {
  const pattern = /[^\x00-\xff]+/g;
  const strings = value.match(pattern);
  let result = value.length;

  if (strings) {
    const doubleByteLen = strings.join('').length;

    result = result - doubleByteLen + doubleByteLen * 2;
  }

  return result;
};

export default class Textarea extends PureComponent {
  render() {
    const { className, rows = '3', maxLength, value, ...props } = this.props;
    const len = getStringLength(value);

    return (
      <div className={cs['textarea']}>
        <FormControl
          {...props}
          value={value}
          componentClass="textarea"
          className={className}
          rows={rows}
        />
        <span
          className={`${cs['control-txt']} ${len >= maxLength
            ? 'text-danger'
            : ''}`}
        >
          {len}/{maxLength}
        </span>
      </div>
    );
  }
}
