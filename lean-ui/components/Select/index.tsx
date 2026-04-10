import * as React from "react";
import { findDOMNode } from "react-dom";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import Icon from "../Icon";
import Input from "../Input";
import Option from "./Option";
import OptGroup from "./OptGroup";
import Dropdown from "../Dropdown";

const prefixCls = "lean-select";
const fn = () => {};
/**
 *
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“防反跳”了的函数
 */

const _debounce = function(fn: Function, delay: number): any {
  // 定时器，用来 setTimeout
  let timer: any = null;

  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return (...args: any[]) => {
    // 保存函数调用时的上下文和参数，传递给 fn
    let context = this;

    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer);

    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
};

export interface SelectProps {
  /** 指定当前选中的条目 */
  value?: string | number;
  /** 自定义样式 */
  className?: string;
  listClassName?: string;
  /** 可搜索 */
  isSearch?: boolean;
  /** 指定默认选中的条目 */
  defaultValue?: string | number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 选择框默认文字 */
  placeholder?: string;
  /** 支持清除 */
  allowClear?: boolean;
  /** 选中时是否需要勾选 */
  isCheck?: boolean;
  dropdownRender?: (menu: any) => React.ReactNode;
  /** 下拉菜单的 style 属性 */
  dropdownStyle?: React.CSSProperties;
  /** 当下拉列表为空时显示的内容 */
  notFoundContent?: React.ReactNode;
  /** 下拉菜单和选择器是否同宽 */
  dropdownMatchSelectWidth?: boolean;
  /** 控件尺寸 */
  size?: "large" | "default" | "small";
  onBlur?: React.EventHandler<any>;
  onFocus?: React.EventHandler<any>;
  labelShow?: (selected: object) => HTMLElement;
  /** 选中 option 时调用 */
  onChange?: React.EventHandler<any>;
  /** 被选中时调用，参数为选中项的value值 */
  onSelect?: (value: string, item?: object) => void;
  /** 文本框值变化时回调 */
  onSearch?: React.EventHandler<any>;
  children?: Array<React.ReactNode> | React.ReactNode;
  //菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。
  getPopupContainer?: (triggerNode: Element) => HTMLElement;
  /** 搜索输入框的 placeholder */
  searchPlaceholder?: string;
}

class Select extends React.Component<SelectProps, any> {
  static Option: typeof Option;
  static OptGroup: typeof OptGroup;

  static defaultProps = {
    onSelect: fn,
    disabled: false,
    allowClear: false,
    isCheck: true,
    dropdownMatchSelectWidth: true
  };

  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]),
    isSearch: PropTypes.bool,
    isCheck: PropTypes.bool,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    disabled: PropTypes.bool,
    allowClear: PropTypes.bool,
    placeholder: PropTypes.string,
    dropdownStyle: PropTypes.object,
    notFoundContent: PropTypes.string,
    dropdownMatchSelectWidth: PropTypes.bool,
    size: PropTypes.oneOf(["small", "large", "default"]),
    getPopupContainer: PropTypes.func,
    labelShow: PropTypes.func
  };

  static childContextTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    searchValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    searchOnLoading: PropTypes.bool,
    isSearch: PropTypes.bool,
    isCheck: PropTypes.bool,
    onSearch: PropTypes.func,
    onSelectOption: PropTypes.func
  };

  getChildContext() {
    const { onChange } = this.props;
    return {
      value: this.state.value,
      isCheck: this.props.isCheck,
      searchValue: onChange ? "" : this.state.searchValue,
      onSelectOption: this.onSelectOption
    };
  }
  getOptionValue = (val: any) => {
    this.setState({
      inputValue: val
    });
  };

  constructor(props: SelectProps) {
    super(props);
    let value: string | number;
    if ("value" in props) {
      value = props.value;
    } else {
      value = props.defaultValue;
    }
    const optionsInfo = this.getOptionsInfoFromProps(props);
    const inputValue = this.hasValue(value)
      ? this.getLabelBySingleValue(value, optionsInfo)
      : "";
    this.state = {
      value: value,
      inputValue,
      searchValue: "",
      // 异步拉取数据加载状态
      searchOnLoading: false,
      _focused: false,
      optionsInfo
    };
  }
  private dropdown: any;

  docOnClick = (e: MouseEvent) => {
    if (findDOMNode(this).contains(e.target)) {
      return;
    } else if (this.dropdown && findDOMNode(this.dropdown).contains(e.target)) {
      return;
    } else {
      this.onOuterBlur(e);
    }
  };

  hasValue(v: any) {
    return v !== undefined;
  }

  componentDidMount() {
    document.addEventListener("click", this.docOnClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.docOnClick);
  }

  componentWillReceiveProps(nextProps: SelectProps) {
    const optionsInfo = this.getOptionsInfoFromProps(nextProps);
    this.setState({
      optionsInfo
    });
    if ("value" in nextProps) {
      this.setState({
        value: nextProps.value,
        inputValue: this.hasValue(nextProps.value)
          ? this.getLabelBySingleValue(nextProps.value, optionsInfo)
          : ""
      });
    }
  }

  /** select框focus事件 */

  onOuterFocus = (event: any) => {
    const { disabled, onFocus } = this.props;
    if (disabled) {
      return;
    }
    if (this.state._focused) {
      return;
    }
    onFocus && onFocus(event);
    this.setState({
      _focused: true
    });
  };

  /** select框blur事件 */
  onOuterBlur = (event: any) => {
    const { disabled, onBlur } = this.props;
    const { _focused } = this.state;
    if (disabled) {
      return;
    }
    if (_focused) {
      onBlur && onBlur(event);
    }
    this.setState({
      _focused: false
    });
  };

  getOptionsInfoFromProps = (props: SelectProps) => {
    const options = this.getOptionsFromChildren(props.children);
    const oldOptionsInfo = this.state ? this.state.optionsInfo : {};
    const value = this.state ? this.state.value : [];
    const optionsInfo: any = {};
    options.forEach(option => {
      const singleValue = getValuePropValue(option);
      optionsInfo[getMapKey(singleValue)] = {
        option,
        value: singleValue,
        label: this.getLabelFromOption(option),
        title: option.props.title
      };
    });
    const key = getMapKey(value);
    if (!optionsInfo[key]) {
      optionsInfo[key] = oldOptionsInfo[key];
    }
    return optionsInfo;
  };

  getLabelFromOption = (option: React.ReactElement<any>) => {
    return getPropValue(option, "children");
  };

  getOptionsFromChildren = (
    children: Array<React.ReactNode> | React.ReactNode,
    options: any[] = []
  ) => {
    React.Children.forEach(children, (child: any) => {
      if (!child) {
        return;
      }
      if (child.type && child.type.isSelectOptGroup) {
        this.getOptionsFromChildren(child.props.children, options);
      } else {
        options.push(child);
      }
    });
    return options;
  };

  getLabelBySingleValue = (value: any, optionsInfo: any) => {
    const { label } = this.getOptionInfoBySingleValue(value, optionsInfo);
    return label;
  };
  getOptionInfoBySingleValue = (value: any, optionsInfo: any) => {
    let info;
    optionsInfo = optionsInfo || this.state.optionsInfo;
    if (optionsInfo[getMapKey(value)]) {
      info = optionsInfo[getMapKey(value)];
    }
    if (info) {
      return info;
    }
    let defaultLabel = value;
    const defaultInfo = {
      option: (
        <Option value={value} key={value}>
          {value}
        </Option>
      ),
      value,
      label: defaultLabel
    };
    return defaultInfo;
  };

  //  选中时调用
  onSelectOption = (optionInfo: any, e: any) => {
    const { onSelect } = this.props;
    const { optionsInfo } = this.state;
    const { value, disabled } = optionInfo;
    if (disabled == "true") {
      return;
    }
    const inputValue = this.getLabelBySingleValue(value, optionsInfo);
    this.setState({
      value,
      _focused: false,
      searchValue: "",
      inputValue
    });
    const selectItem = { label: inputValue, value: value };
    onSelect(value, selectItem);
  };

  saveDropdown = (node: any) => {
    this.dropdown = node;
  };
  triggerSearch = _debounce((value: string) => {
    const { onChange } = this.props;
    // 开启加载动画
    const stream: any =
      onChange &&
      (this.setState({
        searchOnLoading: true
      }),
      onChange(value));
    // 请求结束，终止加载动画
    if (stream && "finally" in stream) {
      stream.finally(() => {
        this.setState({
          searchOnLoading: false
        });
      });
    } else {
      setTimeout(() => {
        // 3秒后强制停止动画
        this.setState({
          searchOnLoading: false
        });
      }, 3 * 1000);
    }
  }, 200);
  //搜索框事件
  searchChange = (e: any) => {
    this.setState({
      searchValue: e.target.value
    });
    this.triggerSearch(e.target.value);
  };
  searchPressEnter = (val: any) => {};

  clearValue = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    this.setState(
      {
        value: undefined,
        inputValue: ""
      },
      () => {
        this.props.onSelect("");
      }
    );
  };

  /** dropdown菜单 */
  renderDropDown(childrens: React.ReactNode) {
    const {
      dropdownStyle,
      dropdownMatchSelectWidth,
      isSearch,
      dropdownRender,
      searchPlaceholder
    } = this.props;
    const { searchOnLoading, searchValue } = this.state;
    let style = dropdownMatchSelectWidth
      ? {
          ...dropdownStyle,
          width: "100%"
        }
      : dropdownStyle;
    return (
      <div
        style={style}
        className={`${prefixCls}-dropdown`}
        ref={this.saveDropdown}
      >
        {isSearch && (
          <Input
            value={this.state.searchValue}
            onChange={this.searchChange}
            onPressEnter={this.searchPressEnter}
            className={`${prefixCls}-search`}
            suffix={<Icon icon="search" />}
            placeholder={searchPlaceholder}
          />
        )}
        {searchOnLoading ? (
          <div className={`${prefixCls}-search-loading`}>
            <i className={`${prefixCls}-search-loading-icon`} />
          </div>
        ) : dropdownRender ? (
          dropdownRender(childrens)
        ) : (
          childrens
        )}
      </div>
    );
  }

  /** select框 */
  renderSelectWrap(children: React.ReactElement<any>) {
    const {
      disabled,
      placeholder,
      className,
      listClassName,
      size,
      allowClear,
      getPopupContainer,
      labelShow
    } = this.props;
    const { _focused, value, inputValue } = this.state;
    const outerClassNames = classNames(prefixCls, className, {
      [`${prefixCls}-focused`]: _focused,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-lg`]: size == "large",
      [`${prefixCls}-sm`]: size == "small"
    });
    const selectedItem = { label: inputValue, value: value };
    const label = labelShow ? labelShow(selectedItem) : inputValue;
    return (
      <Dropdown
        overlay={children}
        trigger={["click"]}
        visible={_focused}
        overlayClassName={listClassName}
        getPopupContainer={getPopupContainer}
      >
        <div className={outerClassNames} onClick={this.onOuterFocus}>
          <div className={`${prefixCls}-selection`}>
            {this.hasValue(value) ? (
              <div className={`${prefixCls}-value`}>{label}</div>
            ) : (
              <div className={`${prefixCls}-placeholder`}>{placeholder}</div>
            )}
            {this.hasValue(value) && allowClear && !disabled ? (
              <Icon
                onClick={this.clearValue}
                className={`${prefixCls}-clear`}
                icon="error"
              />
            ) : (
              <span className={`${prefixCls}-arrow`} />
            )}
          </div>
        </div>
      </Dropdown>
    );
  }

  render() {
    const { children } = this.props;
    const cls = classNames(`${prefixCls}-dropdown-menu`, "loading-outline");
    return this.renderSelectWrap(
      this.renderDropDown(children ? <ul className={cls}>{children}</ul> : null)
    );
  }
}

Select.Option = Option;
Select.OptGroup = OptGroup;

export default Select;

export function getMapKey(value: any) {
  return `${typeof value}-${value}`;
}

export function getValuePropValue(child: any) {
  const props = child.props;
  if ("value" in props) {
    return props.value;
  }
  if (child.key) {
    return child.key;
  }
  if (child.type && child.type.isSelectOptGroup && props.label) {
    return props.label;
  }
  if (child.type && child.type.isSelectOption && props.children) {
    return props.children;
  }

  throw new Error(
    `Need at least a key or a value or a label (only for OptGroup) for ${child}`
  );
}
export function getPropValue(child: React.ReactElement<any>, prop: string) {
  if (prop === "value") {
    return getValuePropValue(child);
  }
  return child.props[prop];
}
