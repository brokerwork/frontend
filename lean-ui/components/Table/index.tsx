import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import EditablePopover, { FieldConfigInt } from "./EditablePopover";
import Checkbox from "../Checkbox";
import Icon from "../Icon";
import { any } from "prop-types";

const prefix = "lean-table";
const fn = function() {};

export interface THeadProps {}
export class THead extends React.Component<THeadProps, any> {
  render() {
    const { children } = this.props;
    return (
      <thead>
        <tr>{children}</tr>
      </thead>
    );
  }
}

export interface TThProps {
  onClick?: any;
  className?: string;
  fixed?: boolean;
  [t: string]: any;
}
export class TTh extends React.Component<TThProps, any> {
  render() {
    const { children, onClick, fixed, className, ...other } = this.props;
    const cls = classNames(className, {
      [`${prefix}-fixed-header-th`]: fixed
    });
    return (
      <th onClick={onClick} className={cls} {...other}>
        {fixed && (
          <span className={`${prefix}-fixed-header-item`}>{children}</span>
        )}
        {fixed ? (
          <span className={`${prefix}-fixed-header-hidden`}>{children}</span>
        ) : (
          children
        )}
      </th>
    );
  }
}

export interface TBodyProps {}
export class TBody extends React.Component<TBodyProps, any> {
  render() {
    const { children } = this.props;
    return <tbody>{children}</tbody>;
  }
}

export interface TTdProps {
  fieldConfig?: FieldConfigInt;
  editable?: boolean;
  onClick?: React.MouseEventHandler<HTMLTableCellElement>;
  className?: string;
  [t: string]: any;
}
export class TTd extends React.Component<TTdProps, any> {
  render() {
    const {
      children,
      className,
      onClick,
      editable,
      fieldConfig,
      ...other
    } = this.props;
    const cls = classNames(`${prefix}-cell`, className);
    if (Boolean(editable)) {
      return (
        <td
          className={classNames(`${prefix}-edit-cell`, className)}
          onClick={onClick}
        >
          <EditablePopover fieldConfig={fieldConfig}>
            {children}
          </EditablePopover>
        </td>
      );
    }
    return (
      <td className={cls} onClick={onClick} {...other}>
        {children}
      </td>
    );
  }
}

export interface SelectionParam {
  key?: string;
  selectedKeys: string[];
  item: any;
  event: any;
}

export interface SelectionOptions {
  onChange: (param: SelectionParam) => void;
  selectedHeader: React.ReactChild;
  selectedKeys?: string[];
  selectFieldKey: string;
}

export interface ExpandParam {
  key?: string;
  expandedKeys: string[];
  item: any;
}

export interface ExpandOptions {
  onChange: (param: ExpandParam) => void;
  expandedKeys?: string[];
  expandFieldKey: string;
  expandOnRowClick?: boolean;
}

export interface ExpandRowParam {
  data: any;
  index: number;
  expaned: boolean;
}

export interface TableProps {
  className?: string;
  // renderCell?: ({ key: string, item: T, index: number }) => React.ReactNode;
  renderCell(arg: {
    key: string;
    data: any;
    index: number;
    rowIndex: number;
    rowData: any;
    listData: any;
  }): any;
  renderHeadCell?: any;
  renderExpanedRow?(arg: ExpandRowParam): React.ReactNode;
  renderExpanedRowCustom?(arg: ExpandRowParam): React.ReactNode;
  // 自定义展开ICON
  customExpanedIcon?(
    expanded: boolean,
    onClick: (item: any) => void
  ): React.ReactNode;
  columns?: object[];
  striped?: boolean;
  bordered?: boolean;
  fixedHeader?: boolean;
  rowSelectOptions?: SelectionOptions;
  rowExpandOptions?: ExpandOptions;
  onTableScroll?(e?: React.UIEvent<HTMLDivElement>): void;
  onRowClick?(e: React.FormEvent<HTMLTableRowElement>, data: any): void;
  data?: object[];
  lastRow?: any;
  renderTbody?: any;
  showTableHeader?: boolean; //设置是否显示表头
  // 添加行className
  rowClassName?(data: any): string;
  pager?: React.ReactNode; //该属性是专门给列表页使用，解决 scroll 问题
}
class Table extends React.Component<TableProps, any> {
  static Heade: typeof THead;
  static Body: typeof TBody;
  static Td: typeof TTd;
  static Th: typeof TTh;
  static defaultTypes = {
    renderCell: fn
  };
  static propTypes = {
    className: PropTypes.string,
    renderCell: PropTypes.func,
    striped: PropTypes.bool,
    fixedHeader: PropTypes.bool,
    columns: PropTypes.array,
    bordered: PropTypes.bool,
    data: PropTypes.array,
    onTableScroll: PropTypes.func,
    onRowClick: PropTypes.func,
    lastRow: PropTypes.node,
    rowClassName: PropTypes.func,
    renderTbody: PropTypes.func
  };
  _renderHeadCell = (item: any, index: number): React.ReactNode => {
    const { name, icon, onClick } = item;
    const { renderHeadCell, fixedHeader } = this.props;
    let reactNode;
    if (typeof renderHeadCell === "function") {
      reactNode = renderHeadCell({ item, index, fixed: fixedHeader });
    }
    if (!reactNode) {
      reactNode = (
        <TTh key={index} onClick={onClick} fixed={fixedHeader}>
          <div
            style={{ display: "flex", height: "100%", alignItems: "center" }}
          >
            <span>{name}</span>
            {Boolean(icon) && (
              <Icon className={`${prefix}-header-icon`} icon={icon} />
            )}
          </div>
        </TTh>
      );
    }
    return reactNode;
  };
  _onSelected = (type: "header" | "row", item: any, e: any) => {
    const { data, rowSelectOptions } = this.props;
    const { onChange, selectedKeys, selectFieldKey } = rowSelectOptions;
    const { checked } = e.target;
    let newSelectedKeys = Array.isArray(selectedKeys)
      ? selectedKeys.concat()
      : [];
    if (type === "row") {
      const currentItemKey = item[selectFieldKey];
      if (checked) {
        newSelectedKeys.push(currentItemKey);
      } else {
        newSelectedKeys = selectedKeys.filter(key => key !== currentItemKey);
      }
    } else if (type === "header") {
      if (!checked || !Array.isArray(data)) {
        newSelectedKeys = [];
      } else {
        newSelectedKeys = data.map((dataItem: any) => dataItem[selectFieldKey]);
      }
    }

    onChange({
      event: e,
      selectedKeys: newSelectedKeys,
      item
    });
  };

  // componentWillReceiveProps(nextProps: TableProps) {

  // }

  _selectionItem = (
    type: "header" | "row" | "selectedHeader",
    item?: any
  ): React.ReactNode => {
    const { rowSelectOptions, data, fixedHeader } = this.props;
    const selectable = Boolean(rowSelectOptions);
    let ele = null;
    if (selectable) {
      const { selectedKeys, selectFieldKey } = rowSelectOptions;
      let checked = false;
      let indeterminate = false;
      if (["selectedHeader", "header"].includes(type)) {
        if (Array.isArray(selectedKeys) && Array.isArray(data)) {
          checked = selectedKeys.length === data.length;
          indeterminate =
            selectedKeys.length !== 0 && selectedKeys.length < data.length;
        }
        ele = (
          <Checkbox
            onChange={this._onSelected.bind(this, "header", null)}
            indeterminate={indeterminate}
            checked={checked}
          />
        );
        if (type === "header") {
          ele = (
            <TTh fixed={fixedHeader} className={`${prefix}-header-checkbox`}>
              {ele}
            </TTh>
          );
        }
      } else if (type === "row") {
        checked =
          Array.isArray(selectedKeys) &&
          Boolean(
            selectedKeys.find(key => `${item[selectFieldKey]}` === `${key}`)
          );
        ele = (
          <TTd>
            <Checkbox
              onChange={this._onSelected.bind(this, type, item)}
              checked={checked}
            />
          </TTd>
        );
      }
    }
    return ele;
  };
  _renderItem = (item: any, index: number): React.ReactNode => {
    const {
      columns,
      rowSelectOptions,
      rowExpandOptions,
      renderExpanedRow,
      rowClassName,
      renderExpanedRowCustom
    } = this.props;
    let extraClassname = "";
    if (rowClassName) {
      extraClassname = rowClassName(item);
    }
    let trCls = classNames(extraClassname);
    if (rowSelectOptions) {
      const { selectedKeys, selectFieldKey } = rowSelectOptions;
      trCls = classNames(extraClassname, {
        [`${prefix}-tr-checked`]: Boolean(
          selectedKeys.find(key => `${item[selectFieldKey]}` === `${key}`)
        )
      });
    }
    // 展开功能
    if (!!rowExpandOptions && item.expanedRow) {
      const d = item.data;
      if (typeof renderExpanedRowCustom === "function") {
        return renderExpanedRowCustom({
          data: d,
          index,
          expaned: true
        });
      }
      return (
        <tr key={d.id || index} onClick={this._onRowClick.bind(this, d)}>
          <TTd />
          <TTd colSpan={columns.length}>
            {typeof renderExpanedRow === "function" &&
              renderExpanedRow({ data: d, index, expaned: true })}
          </TTd>
        </tr>
      );
    }
    return (
      <tr
        key={item.id || index}
        className={trCls}
        onClick={this._onRowClick.bind(this, item)}
      >
        {this._renderExpandCell(item)}
        {this._selectionItem("row", item)}
        {columns.map(this._renderCell.bind(this, item, index))}
      </tr>
    );
  };
  _onRowClick(data: any, e: React.FormEvent<HTMLTableRowElement>) {
    const { onRowClick, rowExpandOptions } = this.props;
    if (onRowClick) {
      onRowClick(e, data);
    }
    if (rowExpandOptions && rowExpandOptions.expandOnRowClick) {
      this._onExpandIconClick(data);
    }
  }
  _renderExpandCell = (item: any) => {
    const { rowExpandOptions, customExpanedIcon } = this.props;
    if (!rowExpandOptions) return null;
    const { expandedKeys, expandFieldKey } = rowExpandOptions;
    const expanded = expandedKeys.includes(`${item[expandFieldKey]}`);
    return (
      <TTd>
        {customExpanedIcon ? (
          customExpanedIcon(expanded, this._onExpandIconClick.bind(this, item))
        ) : (
          <Icon
            icon={!expanded ? "arrow-right" : "arrow-down"}
            onClick={this._onExpandIconClick.bind(this, item)}
          />
        )}
      </TTd>
    );
  };
  _onExpandIconClick = (data: any) => {
    const { rowExpandOptions } = this.props;
    if (!!rowExpandOptions && typeof rowExpandOptions.onChange === "function") {
      const { expandFieldKey, expandedKeys } = rowExpandOptions;
      const s = new Set(expandedKeys);
      const key = data[expandFieldKey] + "";
      if (s.has(key)) {
        s.delete(key);
      } else {
        s.add(key);
      }
      rowExpandOptions.onChange({
        key,
        expandedKeys: Array.from(s),
        item: data
      });
    }
  };
  _renderCell = (
    item: any,
    rowIndex: number,
    sItem: any,
    sIndex: number
  ): React.ReactNode => {
    const { renderCell } = this.props;
    const { key } = sItem;
    const data = item[key];
    return renderCell({
      key,
      data,
      index: sIndex,
      rowIndex: rowIndex,
      rowData: item,
      listData: sItem
    });
  };
  renderSelectedHeader = () => {
    const { rowSelectOptions } = this.props;
    const selectionable = Boolean(rowSelectOptions);
    if (
      !selectionable ||
      !Array.isArray(rowSelectOptions.selectedKeys) ||
      rowSelectOptions.selectedKeys.length === 0
    ) {
      return null;
    }
    return (
      <div className={`${prefix}-selected-header`}>
        {this._selectionItem("selectedHeader")}
        {rowSelectOptions.selectedHeader}
      </div>
    );
  };
  _renderRowByData = () => {
    const { data, rowExpandOptions } = this.props;
    let d: any[] = [];
    if (!!rowExpandOptions) {
      const {
        expandedKeys,
        expandFieldKey
      } = rowExpandOptions as ExpandOptions;
      data.forEach((item: any) => {
        d.push(item);
        const hasExpanded = expandedKeys.includes(`${item[expandFieldKey]}`);
        if (hasExpanded) {
          d.push({ expanedRow: item[expandFieldKey], data: item });
        }
      });
    } else {
      d = data;
    }
    return d.map(this._renderItem);
  };
  render() {
    const {
      className,
      striped,
      bordered,
      columns,
      fixedHeader,
      rowExpandOptions,
      onTableScroll,
      lastRow,
      renderTbody,
      pager,
      showTableHeader = true
    } = this.props;
    const cls = classNames(className, `${prefix}-fixed-scroll`);
    const tableCls = classNames(prefix, {
      [`${prefix}-striped`]: Boolean(striped),
      [`${prefix}-bordered`]: Boolean(bordered)
    });
    const containerCls = classNames({
      [`${prefix}-fixed-header`]: fixedHeader,
      [`${prefix}-fixed-header-border`]: Boolean(bordered),
      [`${prefix}-container`]: true
    });
    return (
      <div className={containerCls}>
        {this.renderSelectedHeader()}
        <div className={cls} onScroll={onTableScroll}>
          <table className={tableCls}>
            {Array.isArray(columns) && showTableHeader && (
              <thead>
                <tr>
                  {!!rowExpandOptions && <TTh width={20} />}
                  {this._selectionItem("header")}
                  {columns.map(this._renderHeadCell)}
                </tr>
              </thead>
            )}
            {renderTbody ? (
              renderTbody()
            ) : (
              <tbody>
                {/* {data.map(this._renderItem)} */}
                {renderTbody ? null : this._renderRowByData()}
                {lastRow ? lastRow : null}
              </tbody>
            )}
          </table>
          {pager ? pager : null}
        </div>
      </div>
    );
  }
}

Table.Heade = THead;
Table.Body = TBody;
Table.Td = TTd;
Table.Th = TTh;

export default Table;
