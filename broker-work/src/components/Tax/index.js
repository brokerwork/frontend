import i18n from 'utils/i18n';
import cs from './Tax.less';
import { DropdownForCode } from 'components/Dropdown';
import { getCountryCode } from 'utils/phoneCountryCode';
import { getCountry } from 'utils/country';
import { countryCodeStaticDir, languages } from 'utils/config';
import language from 'utils/language';

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

  _renderValue = selected => {
    return selected.label;
  };

  _renderMenuItem = item => {
    return item.value ? (
      <div className={cs['country']} title={item.label}>
        <span className={cs['country-name']}>{item.label}</span>
      </div>
    ) : (
      item.label
    );
  };

  filterCountry = text => {
    const { data = [] } = this.state;
    const filteredCountry = text
      ? data.filter(item =>
          `${item.label}`
            .replace(/\s/g, '')
            .toLowerCase()
            .includes(text.replace(/\s/g, '').toLowerCase())
        )
      : data;

    return Promise.resolve(filteredCountry);
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
        <DropdownForCode
          defaultSelect={{
            value: '',
            label: i18n['general.default_tax_select']
          }}
          placeholder={i18n['general.default_tax_select']}
          className={cs['dropdown']}
          value={value.countryCode}
          renderValue={this._renderValue}
          renderMenuItem={this._renderMenuItem}
          data={data}
          disabled={disabled}
          onChange={this.onChange.bind(this, 'countryCode')}
          searchable
          pipe={this.filterCountry}
        />
        <div className={cs['input-wrap']}>
          <input
            type="text"
            className={`form-control ${cs['input']}`}
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
