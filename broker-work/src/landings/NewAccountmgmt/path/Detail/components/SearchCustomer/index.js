import { post } from 'utils/ajax';
import i18n from 'utils/i18n';
import { Select } from 'lean-ui';

export default class SearchCustomer extends PureComponent {
  constructor(props) {
    super();
    this.state = this.stateProcess(props);
  }
  stateProcess = props => ({
    value: props.value && props.value.value ? props.value.value : '',
    option: props.value ? [props.value] : []
  });
  componentWillReceiveProps(props) {
    this.setState(this.stateProcess(props));
  }

  pipe = value => {
    if (!value) {
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
        logicType: 'OR',
        advanceConditions: [
          { value, field: 'customNo', opt: 'REGEX' },
          { value, field: 'customName', opt: 'REGEX' }
        ]
      }
    }).then(this.handleData);
  };

  handleData = res => {
    if (!res.result) return Promise.resolve(res);

    const data = res.data.list.map(customer => {
      return {
        label: `${customer.customNo}：${customer.customName}`,
        value: customer.customerId,
        _originData: customer
      };
    });
    this.setState({
      option: data
    });

    return Promise.resolve(data);
  };

  onSelect = selected => {
    const { onSelect } = this.props;
    const { option } = this.state;
    this.setState(
      {
        value: selected
      },
      () => {
        if (onSelect) {
          const item = option.find(op => op.value === selected);
          onSelect(item);
        }
      }
    );
  };

  render() {
    const { disabled } = this.props;
    const { value, option } = this.state;
    return (
      <Select
        disabled={disabled}
        onSelect={this.onSelect}
        onChange={this.pipe}
        isSearch
        value={value}
        searchPlaceholder={
          i18n['account.search.search_customer.search_placehoder']
        }
      >
        {option.map(op => (
          <Select.Option value={op.value} key={op.value}>
            {op.label}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
