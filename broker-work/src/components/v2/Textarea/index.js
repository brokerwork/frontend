import { Input } from 'lean-ui';
import cs from './style.less';

export const getStringLength = (value = '') => {
  // const pattern = /[^\x00-\xff]+/g;
  // const strings = value.match(pattern);
  // let result = value.length;

  // if (strings) {
  //   const doubleByteLen = strings.join('').length;

  //   result = result - doubleByteLen + doubleByteLen * 2;
  // }

  // return result;
  return value.length; //按照一个中文只算一个字符
};

export default class Textarea extends PureComponent {
  render() {
    const { className, rows = '3', maxLength, value, ...props } = this.props;
    const len = getStringLength(value);

    return (
      <div className={cs['textarea']}>
        <Input.TextArea
          {...props}
          value={value}
          className={className}
          maxLength={maxLength}
        />
        <span
          className={`${cs['control-txt']} ${
            len >= maxLength ? 'text-danger' : ''
          }`}
        >
          {maxLength ? `${len}/${maxLength}` : ''}
        </span>
      </div>
    );
  }
}
