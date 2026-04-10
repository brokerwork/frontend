import i18n from 'utils/i18n';
import cs from './style.less';
import { Input } from 'lean-ui';
import { getCountry } from 'utils/country';
import language from 'utils/language';
import { Select } from 'lean-ui';

const lang = language.getType();

export default class Tax extends PureComponent {
  state = {
    data: getCountry(true)
  };

  onChange = (field, e) => {
    const { value, onChange } = this.props;

    onChange({
      ...value,
      [field]: field === 'countryCode' ? e : e.target.value
    });
  };

  onBlur = () => {
    const { onBlur, value } = this.props;
    const { selected } = this.state;

    if (onBlur) onBlur(value);
  };

  render() {
    const { data } = this.state;
    const { disabled, className = '', error, onFocus, value } = this.props;

    return (
      <div
        className={`tax-field ${cs['container']} ${className} ${
          error ? cs['error'] : ''
        }`}
      >
        <Select
          placeholder={i18n['general.default_tax_select']}
          value={value.countryCode}
          disabled={disabled}
          onSelect={this.onChange.bind(this, 'countryCode')}
          isSearch
          onFocus={onFocus}
          getPopupContainer={triggerNode => triggerNode.parentElement}
        >
          {data &&
            data.map(d => (
              <Select.Option value={d.value} key={d.value}>
                {d.label}
              </Select.Option>
            ))}
        </Select>
        <div className={cs['input-wrap']}>
          <Input
            className={`${cs['input']}`}
            value={value.tin}
            disabled={disabled}
            onChange={this.onChange.bind(this, 'tin')}
            onFocus={onFocus}
            onBlur={this.onBlur}
          />
        </div>
      </div>
    );
  }
}
