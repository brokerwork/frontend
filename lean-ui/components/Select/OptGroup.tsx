import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";

const prefixCls = "lean-select";

export interface OptGroupProps {
  className?: string;
  label?: string | React.ReactNode;
  children?: any;
}

class OptGroup extends React.Component<OptGroupProps, any> {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    children: PropTypes.any
  };
  static isSelectOptGroup = true;
  render() {
    const { label, children, className } = this.props;
    const cls = classNames(className, `${prefixCls}-optgroup`);
    return (
      <li className={cls}>
        <div className={`${prefixCls}-optgroup-label`}>{label}</div>
        <ul className={`${prefixCls}-optgroup-menu`}>{children}</ul>
      </li>
    );
  }
}

export default OptGroup;
