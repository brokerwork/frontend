import i18n from 'utils/i18n';
import { getCountry } from 'utils/country';
import { DropdownForCode } from 'components/Dropdown';
import cs from './CountrySelector.less';

let countryData = getCountry();
const fn = () => {};
export default class CountrySelector extends PureComponent {
  render() {
    const {
      value = {},
      disabled,
      itemClassName = '',
      className = ''
    } = this.props;
    const { country, city, province } = this.state;
    return (
      <div className={`${cs['container']} ${className}`}>
        <DropdownForCode
          value={value.country || ''}
          onChange={this.onChange.bind(this, 'country')}
          disabled={disabled}
          data={country}
          defaultSelect
          className={`${cs['item']} ${itemClassName}`}
          searchable
          pipe={this.filterCountry}
        />
        <DropdownForCode
          value={value.province || ''}
          onChange={this.onChange.bind(this, 'province')}
          disabled={disabled}
          data={province}
          defaultSelect
          className={`${cs['item']} ${itemClassName}`}
        />
        <DropdownForCode
          value={value.city || ''}
          onChange={this.onChange.bind(this, 'city')}
          disabled={disabled}
          data={city}
          defaultSelect
          className={`${cs['item']} ${itemClassName}`}
        />
      </div>
    );
  }

  getData = props => {
    const { value } = props;
    if (!countryData) countryData = getCountry();
    let country = countryData.filter(item => item.pid == '0');
    let province = [];
    let city = [];

    if (value) {
      if (value.country) {
        const currentCountry =
          countryData.find(item => item.value == value.country) || {};
        province = countryData.filter(item => item.pid == currentCountry.value);
      }

      if (value.province) {
        const currentProvince =
          countryData.find(item => item.value == value.province) || {};
        city = countryData.filter(item => item.pid == currentProvince.value);
      }
    }

    return {
      country,
      province,
      city
    };
  };

  constructor(props) {
    super(props);
    const state = this.getData(props);
    this.state = state;
  }

  componentWillReceiveProps(props) {
    const state = this.getData(props);

    this.setState(state);
  }

  onChange(field, e) {
    const { onChange = fn, value = {} } = this.props;
    const __state = {};
    const __data = {};
    const v = e;
    if (field === 'country') {
      __state['province'] = countryData.filter(item => item.pid == v) || [];
      __data['country'] = v;
      __data['city'] = '';
      __data['province'] = '';
      __state['city'] = [];
    } else if (field === 'province') {
      __state['city'] = countryData.filter(item => item.pid == v) || [];
      __data['province'] = v;
      __data['city'] = '';
    } else {
      __data['city'] = v;
    }
    onChange(Object.assign({}, value, __data));
    this.setState(__state);
  }

  filterCountry = filterValue => {
    const { country } = this.state;
    const filteredCountry = filterValue
      ? country.filter(item => {
          return `${item.label}`
            .replace(/\s/g, '')
            .toLowerCase()
            .includes(filterValue.replace(/\s/g, '').toLowerCase());
        })
      : country;
    return Promise.resolve(filteredCountry);
  };
}
