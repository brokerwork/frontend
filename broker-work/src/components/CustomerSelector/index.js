import Dropdown from 'components/Dropdown';
import { post } from 'utils/ajax';

export default class CostomerSelector extends PureComponent {
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
      disabled,
      selectAllButton,
      checkbox
    } = this.props;
    return (
      <Dropdown
        defaultSelect={!!defaultSelect}
        searchable
        disabled={disabled}
        className={className}
        value={value}
        checkbox={checkbox}
        selectAllButton={!!selectAllButton}
        onSelect={this.onSelect}
        pipe={this.searchCustomer}
        handleData={this.handleData}
      />
    );
  }
}
