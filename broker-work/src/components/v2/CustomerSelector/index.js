import { post } from 'utils/ajax';
import { Select, Picklist } from 'lean-ui';
import cs from './UserSelector.less';

export default class CustomerSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getInitData(this.props)
    };
  }

  componentDidMount() {
    this.updateData(this.props);
  }
  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    const { data: nextData } = nextProps;
    if (data && data.length !== nextData && nextData.length) {
      this.updateData(nextProps);
    } else {
      const dataMap =
        data &&
        data.reduce((map, item) => ({ ...map, [item.value]: item.label }), {});
      const isSameData =
        nextData && nextData.every(item => dataMap[item.value]);
      if (!isSameData) {
        this.updateData(nextProps);
      }
    }
  }

  updateData = arg => {
    let data = this.state.data;
    let props = this.props;
    if (Array.isArray(arg)) {
      data = arg;
    } else {
      props = arg;
    }
    this.setState({
      data: data && data.length ? data : this.getInitData(props)
    });
  };

  getInitData = props => {
    const { originValue } = props;
    return originValue || [];
  };

  searchCustomer = text => {
    if (!text) {
      return Promise.resolve({
        result: true,
        data: {
          list: []
        }
      });
    }
    return post({
      url: '/v2/custom/profiles/list',
      data: {
        fuzzyItem: 'CustomerName',
        fuzzyVal: text
      }
    })
      .then(this.handleData)
      .then(res => {
        this.updateData(res);
      });
  };

  handleData = res => {
    if (!res.result) return Promise.reject(false);

    const data = res.data.list.map(customer => {
      return {
        label: `${customer.customNo}：${customer.customName}`,
        value: customer.customerId
      };
    });

    return Promise.resolve(data);
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
      checkbox,
      placeholder,
      size,
      getPopupContainer = trigger => trigger
    } = this.props;
    const { data } = this.state;
    if (checkbox) {
      const val = value ? (Array.isArray(value) ? value : [value]) : [];
      return (
        <div className={cs['user-selector-pick']}>
          <Picklist
            data={data}
            searchable
            getPopupContainer={getPopupContainer}
            className={`${className} `}
            defaultSelectedKeys={val.map(
              item => `${item.value ? item.value : item}`
            )}
            placeholder={placeholder}
            onSearchKeyChange={this.searchCustomer}
            onChange={selectedItem => {
              this.onSelect(
                data.filter(
                  opt => selectedItem && selectedItem.includes(`${opt.value}`)
                )
              );
            }}
          />
        </div>
      );
    }
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
        onChange={this.searchCustomer}
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
