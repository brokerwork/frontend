import i18n from 'utils/i18n';
import { Select } from 'lean-ui';

const fn = () => {};
export default class ReakSearchUser extends PureComponent {
  render() {
    const { defaultValue, disabled, className = '', onChange } = this.props;
    const { data } = this.state;
    return (
      <div className={className}>
        <Select
          onSelect={onChange}
          isSearch
          onChange={this.getUserList}
          disabled={disabled}
          dropdownMatchSelectWidth
          value={defaultValue && defaultValue.value}
        >
          <Select.Option key={'null'} value={'null'}>
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

  getUserList = v => {
    const { getLevelUsers } = this.props;
    getLevelUsers(v).then(res => {
      if (!res.result) return Promise.reject(res);
      if (res && res.result) {
        const data = res.data.map(item => {
          const levelTag = item.levelName ? `(${item.levelName})` : '';
          return {
            label: `${item.name}（${item.entityNo}）${levelTag}`,
            value: item.id
          };
        });
        this.setState({
          data: data && data.length ? data : this.getInitData(this.props)
        });
      }
    });
  };
  componentWillReceiveProps(props) {
    if (props.defaultValue && props.defaultValue.value === 'null') {
      this.state = {
        data: []
      };
    }
  }

  getInitData = props => {
    const { defaultValue } = props;
    return defaultValue && defaultValue.value === 'null' ? [] : [defaultValue];
  };

  constructor(props) {
    super(props);
    this.state = {
      data: this.getInitData(this.props)
    };
  }
}
