import Dropdown from 'components/Dropdown';
import { post } from 'utils/ajax';

export default class UserSelector extends PureComponent {
  getUserList = text => {
    const {
      search,
      url,
      withRight,
      searchByField = true,
      searchCustomer,
      responseHandler = res => res
    } = this.props;
    let params = {
      url: url || '/v1/user/findSimpleByPage',
      data: {
        queryContent: text,
        queryType: search || 'NAME'
      }
    };
    if (withRight) {
      params = {
        url: '/v1/user/findSimpleByPage/hasRight',
        data: {
          queryContent: text,
          queryType: search || 'NAME',
          userSearchType: 'allSee'
        }
      };
    }
    if (searchByField) {
      params = {
        url: url || '/v1/user/findUserByField',
        data: {
          fuzzyValue: text,
          fieldType: search || ['name', 'entityNo']
        }
      };
    }
    if (searchCustomer) {
      params = {
        url: url || '/v2/custom/profiles/list',
        data: {
          advanceConditions: [
            {
              value: text,
              field: 'customNo',
              opt: 'REGEX'
            },
            {
              value: text,
              field: 'customName',
              opt: 'REGEX'
            }
          ],
          logicType: search || 'OR'
        }
      };
    }
    return post(params).then(res => responseHandler(res));
  };

  handleData = res => {
    if (!res.result) return Promise.reject(res);

    const {
      renderMenuItem,
      searchByField = true,
      searchCustomer,
      usePubUserId
    } = this.props;
    const list = searchCustomer
      ? res.data.list
      : searchByField
        ? res.data
        : res.data.list;
    const data = list.map(user => {
      return {
        label: renderMenuItem
          ? renderMenuItem(user)
          : searchCustomer
            ? `${user.customNo}：${user.customName}`
            : `${user.name} (${user.roleName}/${user.entityNo})`,
        value: searchCustomer
          ? user.customerId
          : usePubUserId
            ? user.pubUserId
            : user.id,
        _originData: user
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
      className,
      value,
      disabled,
      searchPlaceHolder,
      defaultSelect = true,
      checkbox,
      selectAllButton,
      autoWidth,
      icon,
      placeholder
    } = this.props;
    const _data = value && checkbox ? value : undefined;
    return (
      <Dropdown
        defaultSelect={defaultSelect}
        searchable
        icon={icon}
        disabled={disabled}
        className={className}
        value={value}
        data={_data}
        checkbox={checkbox}
        selectAllButton={selectAllButton}
        autoWidth
        searchPlaceHolder={searchPlaceHolder}
        placeholder={placeholder}
        onSelect={this.onSelect}
        pipe={this.getUserList}
        handleData={this.handleData}
      />
    );
  }
}
