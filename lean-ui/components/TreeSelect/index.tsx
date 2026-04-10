import * as React from "react";
import RcTreeSelect, {
  TreeNode,
  SHOW_ALL,
  SHOW_PARENT,
  SHOW_CHILD
} from "rc-tree-select";
import * as classNames from "classnames";
import LocaleReceiver from "../locale-provider/LocaleReceiver";
import warning from "../utils/warning";
import Icon from "../Icon";
import { AntTreeNodeProps } from "../Tree";
import omit from "omit.js";

export type SelectSizes = "default" | "large" | "small";
export interface OptionProps {
  disabled?: boolean;
  value?: string | number;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface AbstractSelectProps {
  prefixCls?: string;
  className?: string;
  showAction?: string | string[];
  size?: SelectSizes;
  notFoundContent?: React.ReactNode | null;
  transitionName?: string;
  choiceTransitionName?: string;
  showSearch?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  showArrow?: boolean;
  style?: React.CSSProperties;
  tabIndex?: number;
  placeholder?: string | React.ReactNode;
  defaultActiveFirstOption?: boolean;
  dropdownClassName?: string;
  dropdownStyle?: React.CSSProperties;
  dropdownMenuStyle?: React.CSSProperties;
  dropdownMatchSelectWidth?: boolean;
  onSearch?: (value: string) => any;
  getPopupContainer?: (triggerNode?: Element) => HTMLElement;
  filterOption?:
    | boolean
    | ((inputValue: string, option: React.ReactElement<OptionProps>) => any);
  id?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onDropdownVisibleChange?: (open: boolean) => void;
  autoClearSearchValue?: boolean;
  dropdownRender?: (
    menu?: React.ReactNode,
    props?: SelectProps
  ) => React.ReactNode;
  loading?: boolean;
}
export interface LabeledValue {
  key: string;
  label: React.ReactNode;
}
export interface SelectLocale {
  notFoundContent?: string;
}
export type SelectValue =
  | string
  | string[]
  | number
  | number[]
  | LabeledValue
  | LabeledValue[];
export interface SelectProps<T = SelectValue> extends AbstractSelectProps {
  value?: T;
  defaultValue?: T;
  mode?: "default" | "multiple" | "tags" | "combobox" | string;
  optionLabelProp?: string;
  firstActiveValue?: string | string[];
  onChange?: (
    value: T,
    option: React.ReactElement<any> | React.ReactElement<any>[]
  ) => void;
  onSelect?: (value: T, option: React.ReactElement<any>) => any;
  onDeselect?: (value: T) => any;
  onBlur?: (value: T) => void;
  onFocus?: () => void;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement>;
  onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLInputElement>) => any;
  onMouseLeave?: (e: React.MouseEvent<HTMLInputElement>) => any;
  maxTagCount?: number;
  maxTagPlaceholder?:
    | React.ReactNode
    | ((omittedValues: T[]) => React.ReactNode);
  optionFilterProp?: string;
  labelInValue?: boolean;
  tokenSeparators?: string[];
  getInputElement?: () => React.ReactElement<any>;
  autoFocus?: boolean;
  suffixIcon?: React.ReactNode;
  removeIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
  menuItemSelectedIcon?: React.ReactNode;
}

export type TreeNodeInterface = TreeNodeNormal | TreeNodeSimpleMode;

export interface TreeNodeNormal {
  value: string | number;
  /**
   * @deprecated Please use `title` instead.
   */
  label?: React.ReactNode;
  title?: React.ReactNode;
  key: string;
  isLeaf?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  selectable?: boolean;
  children?: TreeNodeNormal[];
}

export interface TreeNodeSimpleMode {
  /* It is possible to change `id` and `pId` prop keys using TreeDataSimpleMode so those keys can be anything */
  [key: string]: string | boolean | React.ReactNode;
}

export interface TreeDataSimpleMode {
  id?: string;
  pId?: string;
  rootPId?: string;
}

export interface TreeSelectProps extends AbstractSelectProps {
  autoFocus?: boolean;
  defaultValue?: string | number | Array<any>;
  dropdownStyle?: React.CSSProperties;
  filterTreeNode?: (inputValue: string, treeNode: any) => boolean | boolean;
  labelInValue?: boolean;
  loadData?: (node: any) => void;
  maxTagCount?: number;
  maxTagPlaceholder?:
    | React.ReactNode
    | ((omittedValues: any[]) => React.ReactNode);
  multiple?: boolean;
  notFoundContent?: React.ReactNode;
  onChange?: (value: any, label: any, extra: any) => void;
  onSearch?: (value: any) => void;
  onSelect?: (value: any) => void;
  onTreeExpand?: (keys: Array<string>) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  searchPlaceholder?: string;
  searchValue?: string;
  showCheckedStrategy?: "SHOW_ALL" | "SHOW_PARENT" | "SHOW_CHILD";
  suffixIcon?: React.ReactNode;
  treeCheckable?: boolean | React.ReactNode;
  treeCheckStrictly?: boolean;
  treeData?: Array<TreeNodeInterface>;
  treeDataSimpleMode?: boolean | TreeDataSimpleMode;
  treeDefaultExpandAll?: boolean;
  treeDefaultExpandedKeys?: Array<string>;
  treeExpandedKeys?: Array<string>;
  treeIcon?: boolean;
  treeNodeFilterProp?: string;
  treeNodeLabelProp?: string;
  value?: string | number | Array<any>;
}

export default class TreeSelect extends React.Component<TreeSelectProps, any> {
  static TreeNode = TreeNode;
  static SHOW_ALL = SHOW_ALL;
  static SHOW_PARENT = SHOW_PARENT;
  static SHOW_CHILD = SHOW_CHILD;

  static defaultProps = {
    prefixCls: "lean-tselect",
    showSearch: false
  };

  private rcTreeSelect: any;

  constructor(props: TreeSelectProps) {
    super(props);

    warning(
      props.multiple !== false || !props.treeCheckable,
      "`multiple` will alway be `true` when `treeCheckable` is true"
    );
  }

  focus() {
    this.rcTreeSelect.focus();
  }

  blur() {
    this.rcTreeSelect.blur();
  }

  saveTreeSelect = (node: typeof RcTreeSelect) => {
    this.rcTreeSelect = node;
  };

  renderSwitcherIcon = ({ isLeaf }: AntTreeNodeProps) => {
    const { prefixCls } = this.props;
    if (isLeaf) {
      return null;
    }
    return (
      <Icon icon="caret-bottom" className={`${prefixCls}-switcher-icon`} />
    );
  };

  renderTreeSelect = (locale: SelectLocale) => {
    const {
      prefixCls,
      className,
      size,
      notFoundContent,
      dropdownStyle,
      dropdownClassName,
      suffixIcon,
      ...restProps
    } = this.props;
    const rest = omit(restProps, [
      "inputIcon",
      "removeIcon",
      "clearIcon",
      "switcherIcon"
    ]);

    const cls = classNames(
      {
        [`${prefixCls}-lg`]: size === "large",
        [`${prefixCls}-sm`]: size === "small"
      },
      className
    );

    let checkable = rest.treeCheckable;
    if (checkable) {
      checkable = <span className={`${prefixCls}-tree-checkbox-inner`} />;
    }

    const inputIcon = (suffixIcon &&
      (React.isValidElement<{ className?: string }>(suffixIcon)
        ? React.cloneElement(suffixIcon)
        : suffixIcon)) || <span className={`${prefixCls}-arrow-icon`} />;

    const removeIcon = (
      <Icon icon="close" className={`${prefixCls}-remove-icon`} />
    );

    const clearIcon = (
      <Icon icon="error" className={`${prefixCls}-clear-icon`} />
    );

    return (
      <RcTreeSelect
        switcherIcon={this.renderSwitcherIcon}
        inputIcon={inputIcon}
        removeIcon={removeIcon}
        clearIcon={clearIcon}
        {...rest}
        dropdownClassName={classNames(
          dropdownClassName,
          `${prefixCls}-tree-dropdown`
        )}
        prefixCls={prefixCls}
        className={cls}
        dropdownStyle={{
          maxHeight: "100vh",
          overflow: "auto",
          ...dropdownStyle
        }}
        treeCheckable={checkable}
        notFoundContent={notFoundContent || locale.notFoundContent}
        ref={this.saveTreeSelect}
      />
    );
  };

  render() {
    return (
      <LocaleReceiver componentName="Select" defaultLocale={{}}>
        {this.renderTreeSelect}
      </LocaleReceiver>
    );
  }
}
