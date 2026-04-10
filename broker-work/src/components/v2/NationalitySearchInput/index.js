import { Select } from 'lean-ui';
import { getCountry } from 'utils/country';

export default class NationalitySearchInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getInitData(this.props),
      countryData: []
    };
  }

  componentDidMount() {
    this.setState({
      countryData: getCountry()
    });
  }

  getInitData = props => {
    const { originValue } = props;
    return originValue || [];
  };

  searchCity = text => {
    if (!text) {
      return Promise.resolve({
        result: true,
        data: []
      });
    }
    const { countryData } = this.state;
    const regExp = new RegExp(text, 'gi');
    const matchData = countryData.filter(v => v.label.search(regExp) !== -1);

    return Promise.resolve({
      result: true,
      data: matchData || []
    }).then(({ data }) => {
      this.setState({ data: data });
    });
  };

  onSelect = selected => {
    const { onSelect } = this.props;
    if (onSelect) onSelect(selected);
  };

  render() {
    const {
      defaultSelect,
      className,
      value,
      originValue,
      disabled,
      selectAllButton,
      placeholder,
      size,
      checkbox,
      getPopupContainer = trigger => trigger
    } = this.props;
    const { data } = this.state;
    return (
      <Select
        placeholder={placeholder}
        size={size}
        defaultValue={value}
        onSelect={value => {
          this.onSelect(data.find(opt => opt.value == value));
        }}
        isCheck={checkbox}
        isSearch
        onChange={this.searchCity}
        className={className}
        disabled={disabled}
        dropdownMatchSelectWidth
        getPopupContainer={getPopupContainer}
      >
        {data &&
          data.map(opt => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
      </Select>
    );
  }
}
