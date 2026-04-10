import i18n from 'utils/i18n';
import cs from './Phone.less';
import DropdownForCode from 'components/v2/DropdownForCode';
import { Input } from 'lean-ui';
import { getCountryCode } from 'utils/phoneCountryCode';
import { countryCodeStaticDir, languages } from 'utils/config';
import language from 'utils/language';
import { connect } from 'react-redux';

const lang = language.getType();

class Phone extends PureComponent {
  state = {
    data: [],
    selected: {
      countryCode: '',
      phone: ''
    }
  };

  componentDidMount() {
    this.updateStateByProps(this.props);
  }
  updateStateByProps = props => {
    const options = getCountryCode();
    const { value } = props;
    const { selected } = this.state;
    // const code = (languages.find(item => item.value === lang) || {}).code;
    const countryCode = (
      options.find(item => item.isDefault) ||
      options[0] ||
      {}
    ).value;

    const initValue = {
      countryCode:
        !value.phone && !value.countryCode
          ? selected.countryCode || countryCode
          : value.phone && !value.countryCode
            ? '-1'
            : value.countryCode,
      phone: value.phone || ''
    };
    this.setState({
      data: [
        { label: i18n['general.default_phone_select'], value: '-1' }
      ].concat(options),
      selected: initValue
    });
  };
  componentWillReceiveProps(props) {
    const { value } = props;
    const { selected } = this.state;
    if (
      (value.countryCode || '') === selected.countryCode &&
      (value.phone || '') === selected.phone
    ) {
      return;
    } else if (!value || (!value.countryCode && !value.phone)) {
      this.updateStateByProps(props);
    } else {
      this.setState({
        selected: {
          countryCode: !value.countryCode
            ? '-1'
            : value.phone && !value.countryCode
              ? '-1'
              : value.countryCode,
          phone: value.phone || ''
        }
      });
    }
  }

  onChange = (field, e, item) => {
    const { selected } = this.state;
    const { value, onChange } = this.props;
    const __value = {};

    if (field === 'countryCode') {
      __value[field] = e === '-1' || !selected.phone ? '' : e;
    } else {
      const phoneValue = e.target.value;

      if (phoneValue && selected.countryCode !== '-1') {
        __value.countryCode = selected.countryCode;
      }

      if (!phoneValue) {
        __value.countryCode = '';
      }

      __value[field] = phoneValue;
    }

    const filteredValue = {
      phone: value.phone,
      countryCode: value.countryCode,
      phoneStr: value.phoneStr
    }; // 在初始值错误的情况下保证能传递正确的参数
    this.setState(
      {
        selected: {
          ...selected,
          [`${field}`]: field === 'countryCode' ? e : e.target.value
        }
      },
      () => {
        if (onChange) onChange(Object.assign({}, filteredValue, __value));
      }
    );
  };

  onBlur = () => {
    const { onBlur, value } = this.props;
    const { selected } = this.state;

    if (onBlur) onBlur(value);
  };

  _renderValue = selected => {
    const { accessConfig } = this.props;
    return selected.value === '-1' ? (
      selected.label
    ) : selected.value ? (
      accessConfig.showFlag ? (
        <img
          width="18"
          height="12"
          src={`${countryCodeStaticDir}${selected.value.substring(1)}.png`}
          alt={selected.label}
        />
      ) : (
        selected.label
      )
    ) : (
      ''
    );
  };

  _renderMenuItem = item => {
    const { accessConfig } = this.props;
    return item.value !== '-1' ? (
      <span className={cs['country']} title={item.label}>
        {accessConfig &&
          accessConfig.showFlag && (
            <img
              className={cs['country-img']}
              width="18"
              height="12"
              src={`${countryCodeStaticDir}${item.value.substring(1)}.png`}
              alt={item.label}
            />
          )}
        <span className={cs['country-name']}>{item.label}</span>
        <span className={cs['country-code']}>{`${item.value}`}</span>
      </span>
    ) : (
      item.label
    );
  };

  filterCountry = text => {
    const { data = [] } = this.state;
    const options = getCountryCode();
    const filteredCountry = text
      ? options.filter(item =>
          `${item.label}${item.value}`
            .replace(/\s/g, '')
            .toLowerCase()
            .includes(text.replace(/\s/g, '').toLowerCase())
        )
      : options;
    return new Promise((res, rej) => {
      setTimeout(() => {
        this.setState({
          data: filteredCountry
        });
        res();
      }, 800);
    });
  };

  render() {
    const { data, selected } = this.state;
    const { disabled, className = '', error, onFocus } = this.props;
    const isSelected = selected.countryCode !== '-1';

    return (
      <div
        className={`phone-field ${cs['container']} ${className} ${
          isSelected ? cs['isSelected'] : ''
        } ${error ? cs['error'] : ''}`}
      >
        <DropdownForCode
          placeholder={i18n['general.default_phone_select']}
          className={cs['dropdown']}
          value={selected.countryCode}
          labelShow={this._renderValue}
          renderMenuItem={this._renderMenuItem}
          data={data}
          disabled={disabled}
          onSelect={this.onChange.bind(this, 'countryCode')}
          onSearch={this.filterCountry}
          onFocus={onFocus}
          searchable
          searchPlaceholder={i18n['general.search']}
        />
        <div className={cs['input-wrap']}>
          {/* <span className={cs['code']}>{`${selected.countryCode || ''}`}</span> */}
          <Input
            className={`${cs['input']}`}
            value={selected.phone}
            disabled={disabled}
            maxLength={20}
            onChange={this.onChange.bind(this, 'phone')}
            onFocus={onFocus}
            onBlur={this.onBlur}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => {
    const {
      common: { accessConfig }
    } = state;
    return {
      accessConfig
    };
  },
  {}
)(Phone);
