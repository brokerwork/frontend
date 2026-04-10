import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import Dropdown from "../Dropdown";
import Icon from "../Icon";
import Tag from "../Tag";
import Menu from "../Menu";

const prefix = "lean-picklist";

const ALL_KEY = `__all__${Date.now()}`;

export interface ListData {
  label: string;
  value: any;
}
export interface ListGroupData {
  title: string;
  children: ListData[];
}

export type selectedKeysType = string[];

export interface ListProps {
  data: Array<ListGroupData | ListData>;
  searchable?: boolean;
  isRemoteSearch?: boolean;
  selectedKeys?: selectedKeysType;
  onSearchKeyChange?: React.EventHandler<any>;
  onSelect?: any;
  onDeselect?: any;
  selectall?: boolean;
  selectallText?: string;
  searchKey?: string;
}

class List extends React.Component<ListProps, any> {
  keyMath(label: string, key: string): boolean {
    if (!key) return true;
    return label.indexOf(key) !== -1;
  }
  getSelectAllData = (selectedAll: boolean, cls: any) => {
    const { selectall, selectallText, selectedKeys, data } = this.props;
    if (!selectall) return null;
    const keys: string[] = selectedKeys.concat();
    if (selectedAll) {
      keys.push(ALL_KEY);
    }
    return {
      selectedKeys: keys,
      item: (
        <Menu.Item className={cls} key={ALL_KEY}>
          {`${selectallText ? selectallText : "All"}`}
        </Menu.Item>
      )
    };
  };
  render() {
    const {
      data,
      onSelect,
      onDeselect,
      selectall,
      searchable,
      selectedKeys,
      onSearchKeyChange,
      searchKey,
      isRemoteSearch
    } = this.props;
    const cls = classNames(`${prefix}-item`);
    const dataItemSet = new Set();
    const list = data.map(
      (item: any, index: number): React.ReactNode => {
        const { label, value, title, children } = item;
        if (Boolean(title)) {
          return (
            <Menu.ItemGroup title={title} key={index}>
              {Array.isArray(children) &&
                children.map(
                  (subItem: ListData, i: number): React.ReactNode => {
                    if (!this.keyMath(subItem.label, searchKey)) {
                      return null;
                    }
                    selectall && dataItemSet.add(subItem.value);
                    return (
                      <Menu.Item key={subItem.value} className={cls}>
                        {subItem.label}
                      </Menu.Item>
                    );
                  }
                )}
            </Menu.ItemGroup>
          );
        }
        if (!isRemoteSearch && !this.keyMath(label, searchKey)) {
          return null;
        }
        selectall && dataItemSet.add(value);
        return (
          <Menu.Item key={value} className={cls}>
            {label}
          </Menu.Item>
        );
      }
    );
    let keys = selectedKeys;
    let allItem = null;
    if (selectall) {
      const all = selectedKeys.length === dataItemSet.size;
      const allData = this.getSelectAllData(all, cls);
      if (allData) {
        keys = allData.selectedKeys;
        allItem = allData.item;
      }
    }
    return (
      <div className={`${prefix}-list`}>
        {Boolean(searchable) && (
          <div className={`${prefix}-search-input`}>
            <input value={searchKey} onChange={onSearchKeyChange} />
            <Icon className={`${prefix}-search-icon`} icon="search" />
          </div>
        )}
        <Menu
          multiple
          className={`${prefix}-menu`}
          onSelect={onSelect}
          selectedKeys={keys}
          onDeselect={onDeselect}
        >
          {allItem}
          {list}
        </Menu>
      </div>
    );
  }
}

export type selectedItemsType = { value: string; label: string };
export interface PicklistProps {
  text?: string;
  data?: ListData[];
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  selectall?: boolean;
  selectallText?: string;
  onChange?: any;
  defaultSelectedKeys?: selectedKeysType;
  onSearchKeyChange?: React.EventHandler<any>;
  getPopupContainer?: (triggerNode: Element) => HTMLElement;
  // 自定义选中后在Dropdown中显示的内容
  customSelectedDisplay?: (
    selectedItems: selectedItemsType[]
  ) => React.ReactNode;
  onVisibleChange?: (visible: boolean) => void;
  isRemoteSearch?: boolean;
}
class Picklist extends React.Component<PicklistProps, any> {
  static propTypes = {
    text: PropTypes.string,
    selectall: PropTypes.bool,
    selectallText: PropTypes.string,
    data: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    defaultSelectedKeys: PropTypes.array,
    onSearchKeyChange: PropTypes.func,
    getPopupContainer: PropTypes.func,
    customSelectedDisplay: PropTypes.func,
    onVisibleChange: PropTypes.func,
    isRemoteSearch: PropTypes.bool
  };
  state = {
    searchKey: "",
    selectedItems: PropTypes.array,
    stateSelectedKeys: this.props.defaultSelectedKeys || []
  };
  constructor(props: object) {
    super(props);
    this.state.selectedItems = [];
    if (this.state.stateSelectedKeys.length > 0) {
      this.props.data.map((item: any) => {
        const { title, children, value } = item;
        if (title && Array.isArray(children)) {
          children.forEach((subItem: any) => {
            // 如果未曾添加到缓存，且被选中时，则添加
            if (
              this.state.stateSelectedKeys.some(key => key == subItem.value) &&
              !this.state.selectedItems.some(
                (_item: any) => _item.value == subItem.value
              )
            )
              this.state.selectedItems.push(subItem);
          });
        } else if (
          this.state.stateSelectedKeys.some(key => key == value) &&
          !this.state.selectedItems.some(
            (_item: any) => _item.value == item.value
          )
        )
          this.state.selectedItems.push(item);
      });
    }
  }
  getSelectData = ({
    data,
    selectedKeys,
    all = false
  }: {
    data: any[];
    selectedKeys: string[];
    all?: boolean;
  }) => {
    const items = new Set();
    const itemsM: any = {};
    const selectedKeysSet = new Set(selectedKeys);
    (function recursive(d) {
      d.forEach(item => {
        const { title, children, value } = item;
        const v = value ? value.toString() : null;
        if (title && Array.isArray(children)) {
          recursive(children);
        } else if (all) {
          items.add(item);
        } else if (selectedKeysSet.has(v) && !itemsM[v]) {
          items.add(item);
          itemsM[v] = true;
        }
      });
    })(data);
    return Array.from(items);
  };
  componentWillReceiveProps(nextProps: PicklistProps) {
    const { defaultSelectedKeys: nextKeys = [], data } = nextProps;
    const { defaultSelectedKeys: curKeys = [] } = this.props;
    const curKeysStr: string = curKeys.reduce((c, k) => `${c}${k}`, "");
    const nextKeysStr: string = nextKeys.reduce((c, k) => `${c}${k}`, "");
    if (curKeysStr !== nextKeysStr) {
      this.setState({
        stateSelectedKeys: nextKeys || [],
        selectedItems: this.getSelectData({ data, selectedKeys: nextKeys })
      });
    }
  }
  onSearchKeyChange: React.EventHandler<any> = e => {
    const v = e.target.value;
    const { onSearchKeyChange } = this.props;
    this.setState(
      {
        searchKey: v
      },
      () => {
        if (onSearchKeyChange) {
          onSearchKeyChange(v);
        }
      }
    );
  };
  onTagCloseClick = (key: string, e: any) => {
    let { stateSelectedKeys, selectedItems } = this.state;
    e.stopPropagation();
    const selected = stateSelectedKeys.filter(v => v != key);
    selectedItems = selectedItems.filter((item: any) =>
      selected.some((key: any) => key == item.value)
    );
    this.onChange({ selectedKeys: selected, selectedItems });
  };
  onChange = (d: any) => {
    const { selectedKeys, selectedItems } = d;
    const { onChange } = this.props;
    this.setState({
      stateSelectedKeys: selectedKeys,
      selectedItems
    });
    if (typeof onChange === "function") {
      onChange(selectedKeys, selectedItems);
    }
  };
  onDeSelect = (d: any) => {
    const { key } = d;
    // 反选
    if (key === ALL_KEY) {
      this.onChange({ selectedKeys: [], selectedItems: [] });
      return;
    }
    let { stateSelectedKeys } = this.state;
    const { data } = this.props;
    const sMap = new Set(stateSelectedKeys);
    sMap.delete(key);
    const keys = Array.from(sMap);
    const items = this.getSelectData({ data, selectedKeys: keys });
    this.onChange({ selectedKeys: keys, selectedItems: items });
  };
  onSelect = (d: any) => {
    const { key } = d;
    const { stateSelectedKeys } = this.state;
    const { data } = this.props;
    if (key === ALL_KEY) {
      const items = this.getSelectData({ data, selectedKeys: [], all: true });
      const keys = items.map(item => item.value);
      this.onChange({ selectedKeys: keys, selectedItems: items });
    } else {
      const keysSet = new Set(stateSelectedKeys);
      keysSet.add(key);
      const keys = Array.from(keysSet);
      const items = this.getSelectData({ data, selectedKeys: keys });
      this.onChange({ selectedKeys: keys, selectedItems: items });
    }
  };
  onVisibleChange = (visible: boolean) => {
    const { onVisibleChange } = this.props;
    onVisibleChange && onVisibleChange(visible);
    this.setState({
      searchKey: ""
    });
  };
  render() {
    let {
      data = [],
      placeholder,
      searchable,
      getPopupContainer,
      selectall = false,
      selectallText,
      disabled = false,
      customSelectedDisplay,
      isRemoteSearch
    } = this.props;
    const { searchKey, stateSelectedKeys, selectedItems } = this.state;
    const showPlaceholder = selectedItems.length === 0;
    const cls = classNames(`${prefix}-button`, {
      [`${prefix}-button-disabled`]: disabled
    });
    const hoverText = selectedItems.map((item: any) => item.label);
    return (
      <Dropdown
        overlay={
          <List
            data={data}
            searchable={searchable}
            selectall={selectall}
            selectallText={selectallText}
            searchKey={searchKey}
            onSearchKeyChange={this.onSearchKeyChange}
            selectedKeys={stateSelectedKeys}
            onSelect={this.onSelect}
            onDeselect={this.onDeSelect}
            isRemoteSearch={isRemoteSearch}
          />
        }
        disabled={disabled}
        onVisibleChange={this.onVisibleChange}
        className={prefix}
        trigger={["click"]}
        getPopupContainer={getPopupContainer}
      >
        <div className={cls}>
          <div className={`${prefix}-content`} title={hoverText}>
            {typeof customSelectedDisplay === "function"
              ? customSelectedDisplay(selectedItems)
              : selectedItems.map((item: any, index: number) => {
                  const { label, value } = item;
                  return (
                    <Tag
                      closeable
                      key={index}
                      className={`${prefix}-tag`}
                      onCloseClick={this.onTagCloseClick.bind(this, value)}
                    >
                      {label}
                    </Tag>
                  );
                })}
            {showPlaceholder && (
              <span className={`${prefix}-placeholder`}>{placeholder}</span>
            )}
          </div>
          <Icon icon="select" className={`${prefix}-icon`} />
        </div>
      </Dropdown>
    );
  }
}

export default Picklist;
