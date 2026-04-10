import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import Icon from "../Icon";
import ButtonGroup from "./ButtonGroup";

const prefix = "lean";
const fn = () => {};

export type ButtonType =
  | "default"
  | "primary"
  | "warning"
  | "info"
  | "danger"
  | "success";

export interface ButtonProps {
  type?: ButtonType;
  htmlType?: "button" | "submit";
  onClick?: React.EventHandler<any>;
  onFocus?: React.EventHandler<any>;
  onBlur?: React.EventHandler<any>;
  className?: string;
  icon?: string;
  size?: "small" | "large" | "default";
  disabled?: boolean;
  fontType?: string;
  btnRef?: React.Ref<HTMLButtonElement>;
  [k: string]: any;
}

class Button extends React.Component<ButtonProps, any> {
  static Group: typeof ButtonGroup;
  static __LEAN_BUTTON = true;
  static defaultProps = {
    htmlType: "button",
    type: "default",
    size: "default",
    className: "",
    disabled: false,
    onClick: fn
  };
  static propTypes = {
    /** 回调函数 */
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    size: PropTypes.oneOf(["small", "large", "default"]),
    icon: PropTypes.string,
    fontType: PropTypes.string,
    /** html 属性 */
    htmlType: PropTypes.oneOf(["button", "submit"]),
    /** button 种类 */
    type: PropTypes.oneOf([
      "default",
      "primary",
      "warning",
      "info",
      "danger",
      "success"
    ]),
    /** 禁用 */
    disabled: PropTypes.bool
  };
  render() {
    const {
      htmlType,
      type,
      onClick,
      onFocus,
      onBlur,
      size,
      icon,
      children,
      className,
      disabled,
      fontType,
      btnRef,
      ...others
    } = this.props;
    let sizeCls = "";
    if (["small", "large"].indexOf(size) !== -1) {
      sizeCls = size;
    }
    const hasIcon = Boolean(icon);
    const cl = classNames(className, {
      [`${prefix}-btn`]: true,
      [`${prefix}-btn-${sizeCls}`]: Boolean(sizeCls),
      [`${prefix}-btn-icon`]: hasIcon,
      [`${prefix}-btn-${type}`]: true
    });
    return (
      <button
        type={htmlType}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        className={cl}
        disabled={disabled}
        ref={btnRef}
        {...others}
      >
        {hasIcon && <Icon icon={icon} fontType={fontType} />}
        {children}
      </button>
    );
  }
}
Button.Group = ButtonGroup;
export { ButtonGroup };
export default Button;
