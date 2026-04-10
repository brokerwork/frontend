import Dropdown from 'components/Dropdown';
import { post } from 'utils/ajax';
import { Select, Picklist } from 'lean-ui';
import cs from './UserSelector.less';
import { findDOMNode } from 'react-dom';
import i18n from 'utils/i18n';
export default class UserSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: this.getInitData(this.props),
      defaultOptions: this.props.defaultOptions
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
    if (
      originValue &&
      !Array.isArray(originValue) &&
      originValue.value &&
      originValue.label
    ) {
      return [originValue];
    }
    return originValue || [];
  };
  getUserList = text => {
    const { defaultOptions } = this.state;
    defaultOptions &&
      defaultOptions.length &&
      this.setState({
        defaultOptions: []
      });
    const { search, url, withRight, searchByField = true } = this.props;
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
        url: url || '/v1/user/findUserByField?includeAdmin=true',
        data: {
          fuzzyValue: text,
          fieldType: search || ['name', 'entityNo']
        }
      };
    }
    return post(params)
      .then(this.handleData)
      .then(res => {
        this.updateData(res);
      });
  };

  handleData = res => {
    if (!res.result) return Promise.reject(res);

    const { renderMenuItem, searchByField = true, usePubUserId } = this.props;
    const list = searchByField ? res.data : res.data.list;
    const data = list.map(user => {
      return {
        label: renderMenuItem
          ? renderMenuItem(user)
          : // : `${user.name}`,
            // `${user.name} (${user.roleName}/${user.entityNo})`,
            `${user.name} (${user.roleName}/${user.entityNo})`,
        value: `${usePubUserId ? user.pubUserId : user.id}`,
        _originData: user
      };
    });

    return Promise.resolve(data);
  };

  onSelect = selected => {
    const { onSelect, input: { onChange } = {} } = this.props;
    if (onSelect) onSelect(selected);
    onChange && onChange(selected);
  };

  render() {
    let {
      className,
      value,
      disabled,
      searchPlaceHolder,
      defaultSelect = true,
      checkbox,
      selectAllButton,
      autoWidth,
      icon,
      placeholder,
      size,
      getPopupContainer = trigger => trigger,
      originValue
    } = this.props;
    // const _data = value && checkbox ? value : undefined;
    const { data, defaultOptions } = this.state;
    if (this.props.input && this.props.input.value) {
      value = this.props.input.value;
    }
    if (checkbox) {
      const val = value ? (Array.isArray(value) ? value : [value]) : [];
      return (
        <div className={cs['user-selector-pick']} ref={this.saveRef}>
          <Picklist
            data={data}
            searchable
            getPopupContainer={getPopupContainer}
            className={`${className} `}
            defaultSelectedKeys={val.map(
              item => `${item.value ? item.value : item}`
            )}
            placeholder={placeholder}
            onSearchKeyChange={this.getUserList}
            onChange={(selectedItem, selectedArray) => {
              this.onSelect(data.filter(d => selectedItem.includes(d.value)));
            }}
          />
        </div>
      );
    }
    return (
      <Select
        placeholder={placeholder}
        size={size}
        onSelect={value => {
          if (value === '0') {
            const valueObj = {
              value: '0',
              label: i18n['general.default_select']
            };
            this.onSelect(valueObj);
            return;
          }
          this.onSelect(data.find(opt => opt.value == value));
        }}
        isCheck={checkbox}
        isSearch
        onChange={this.getUserList}
        className={`${className} ${cs['orange']}`}
        disabled={disabled}
        dropdownMatchSelectWidth
        getPopupContainer={getPopupContainer}
        defaultValue={value}
        searchPlaceholder={i18n['general.search.search_user']}
      >
        {!(defaultOptions && defaultOptions.length) &&
          !(data && data.length === 1 && data[0].value === '0') && (
            <Select.Option key={'0'} value={'0'}>
              {i18n['general.default_select']}
            </Select.Option>
          )}
        {!(defaultOptions && defaultOptions.length) &&
          data &&
          data.map(opt => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        {defaultOptions &&
          defaultOptions.length &&
          defaultOptions.map(opt => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
      </Select>
    );
  }
}
