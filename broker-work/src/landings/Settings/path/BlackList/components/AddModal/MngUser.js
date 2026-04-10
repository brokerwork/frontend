import Dropdown from 'components/Dropdown';
import { get } from 'utils/ajax';
import i18n from 'utils/i18n'

export default class MngUser extends PureComponent {
  getUserList = text => {
    return get({
      url: `/v1/ta/user/mng/dropdown?keyword=${text}`
    });
  };
  onSelect = selected => {
    const { onChange } = this.props;

    if (onChange) onChange(selected);
  };
  handleData = res => {
    if (!res.result) return Promise.reject(res);
    const end = _.map(res.data, item => ({
      value: item.pubUserId,
      label: item.realname
    }));
    return Promise.resolve(end);
  };
  render() {
    const {
      className,
      value,
      disabled,
      searchPlaceHolder,
      checkbox,
      selectAllButton,
      autoWidth,
      icon,
      placeholder
    } = this.props;
    const _data = value && checkbox ? value : undefined;
    return (
      <Dropdown
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
