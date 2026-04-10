import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";

const prefixCls = "lean-select";

export interface OptionProps {
  /** 是否禁用 */
  disabled?: boolean;
  /** 默认根据此属性值进行筛选 */
  value?: string | number;
  className?: string;
  children?: any;
}

class Option extends React.Component<OptionProps, any> {
  static defaultProps = {
    disabled: false
  };
  static isSelectOption = true;
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    children: PropTypes.any
  };
  static contextTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isCheck: PropTypes.bool,
    onSelectOption: PropTypes.func,
    searchValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  // componentDidMount() {
  //     const { getOptionValue } = this.context
  //     const { children, value } = this.props
  //     if (value == this.context.value) {
  //         getOptionValue(children)
  //     }
  // }

  onSelectOption = (e: React.MouseEvent<HTMLElement>) => {
    const { onSelectOption } = this.context;
    e.stopPropagation();
    onSelectOption(this.props);
  };

  render(): any {
    const { disabled, value, children, className } = this.props;
    const selectValue = this.context.value;
    const isCheck = this.context.isCheck;
    const searchValue = this.context.searchValue;

    const liClassName = classNames(className, `${prefixCls}-option`, {
      [`${prefixCls}-option-disabled`]: disabled,
      [`${prefixCls}-option-check`]: isCheck && selectValue === value,
      [`${prefixCls}-option-active`]: selectValue === value
    });
    let isShow = true;
    if (searchValue && children.toString().indexOf(searchValue) === -1) {
      isShow = false;
    }
    let renderDom = isShow ? (
      <li onClick={this.onSelectOption} className={liClassName}>
        {children}
      </li>
    ) : null;
    return renderDom;
  }
}

export default Option;
