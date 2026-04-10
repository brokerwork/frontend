import { post } from 'utils/ajax';
import i18n from 'utils/i18n';
import cs from './SearchCustomer.less';
import { FormattedMessage } from 'react-intl';
import { Select } from 'lean-ui';

export default class SearchCustomer extends PureComponent {
  searchOptionsMap = {};
  state = {
    searchOptions: []
  };
  onSearchKeyChange = value => {
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
        ],
        fuzzyItem: 'UnbindTaUser',
        fuzzyVal: value
      }
    }).then(this.handleData);
  };

  handleData = res => {
    if (!res.result) return Promise.resolve(res);
    const obj = {};
    const list = (res.data && res.data.list) || [];
    const data = list.map(customer => {
      obj[customer.customerId] = customer;
      return {
        label: `${customer.customNo}：${customer.customName}`,
        value: customer.customerId
        // _originData: customer
      };
    });
    this.searchOptionsMap = obj;
    this.setState({
      searchOptions: data
    });
    return Promise.resolve(true);
  };

  onSelect = (s, selected) => {
    const { onSelect } = this.props;
    selected._originData = this.searchOptionsMap[selected.value];

    if (onSelect) onSelect(selected);
  };

  render() {
    const { value = {}, error = '' } = this.props;
    const { searchOptions } = this.state;
    let v = '';
    if (value && value.value) {
      v = value.value;
    }

    return (
      <div className={cs['search-bar']}>
        <span className="required" />
        {i18n['account.edit_account.customer_binding_field']}
        <Select
          className={cs['dropdown']}
          value={v}
          placeholder={i18n['account.search.search_customer_placeholder']}
          searchPlaceHolder={
            i18n['account.search.search_customer.search_placehoder']
          }
          isSearch
          onChange={this.onSearchKeyChange}
          onSelect={this.onSelect}
        >
          {searchOptions.map((item, index) => {
            return (
              <Select.Option key={index} value={item.value}>
                {item.label}
              </Select.Option>
            );
          })}
        </Select>
        <div className={cs.red}> {error}</div>
      </div>
    );
  }
}