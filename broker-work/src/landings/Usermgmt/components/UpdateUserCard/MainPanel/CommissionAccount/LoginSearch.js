import i18n from 'utils/i18n';
import { Select } from 'lean-ui';

const fn = () => {};
export default class LoginSearch extends PureComponent {
  render() {
    const { defaultValue, disabled, className = '', onChange } = this.props;
    const { data } = this.state;
    return (
      <div className={className}>
        <Select
          onSelect={onChange}
          isSearch
          onChange={this.getLogin}
          disabled={disabled}
          dropdownMatchSelectWidth
          value={defaultValue && defaultValue}
          placeholder={i18n['general.default_select']}
        >
          <Select.Option key={''} value={''}>
            {i18n['general.default_select']}
          </Select.Option>
          {data &&
            data.map(opt => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
        </Select>
      </div>
    );
  }

  onChange = (v, item) => {
    const { onChange } = this.props;
    this.setState({
      selectUser: item
    });
    onChange(v, item);
  };

  getLogin = v => {
    const { getLogin } = this.props;
    getLogin(v).then(res => {
      if (!res.result) return Promise.reject(res);
      if (res && res.result) {
        const data = res.data.map(object => {
          return {
            label: object,
            value: object
          };
        });
        this.setState({
          data: data
        });
      }
    });
  };
  componentWillReceiveProps(props) {
    if (props.defaultValue && !props.defaultValue.length) {
      this.state = {
        data: []
      };
    }
  }

  getInitData = props => {
    const { defaultValue } = props;
    return defaultValue && defaultValue.length
      ? [{ label: defaultValue, value: defaultValue }]
      : [];
  };

  constructor(props) {
    super(props);
    this.state = {
      data: this.getInitData(this.props)
    };
  }
}
