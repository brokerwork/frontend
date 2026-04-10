import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";

const prefix = "lean";
const fn = () => {};

export interface ButtonGroupProps {
  className?: string;
}

class ButtonGroup extends React.Component<ButtonGroupProps, any> {
  static defaultProps = {};
  static propTypes = {
    className: PropTypes.string
  };
  render() {
    const { className, children } = this.props;
    const cls = classNames(className, `${prefix}-btn-group`);
    return <div className={cls}>{children}</div>;
  }
}

export default ButtonGroup;
