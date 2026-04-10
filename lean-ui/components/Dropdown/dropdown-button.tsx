import * as React from "react";
import Button from "../Button";
import { ButtonGroupProps } from "../Button/ButtonGroup";
import Icon from "../Icon";
import Dropdown, { DropDownProps } from "./dropdown";
import * as classNames from "classnames";
const ButtonGroup = Button.Group;

export interface DropdownButtonProps extends ButtonGroupProps, DropDownProps {
  type?: "default" | "primary" | "warning" | "info" | "danger" | "success";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<any>;
  children?: any;
}

export default class DropdownButton extends React.Component<
  DropdownButtonProps,
  any
> {
  static defaultProps = {
    placement: "bottomRight",
    type: "default",
    prefixCls: "lean-dropdown-button"
  };

  render() {
    const {
      type,
      disabled,
      onClick,
      children,
      prefixCls,
      className,
      overlay,
      trigger,
      align,
      visible,
      onVisibleChange,
      placement,
      getPopupContainer,
      ...restProps
    } = this.props;

    const dropdownProps = {
      align,
      overlay,
      disabled,
      trigger: disabled ? [] : trigger,
      onVisibleChange,
      placement,
      getPopupContainer
    };
    if ("visible" in this.props) {
      (dropdownProps as any).visible = visible;
    }

    return (
      <ButtonGroup {...restProps} className={classNames(prefixCls, className)}>
        <Button type={type} disabled={disabled} onClick={onClick}>
          {children}
        </Button>
        <Dropdown {...dropdownProps}>
          <Button type={type}>
            <Icon icon="down" />
          </Button>
        </Dropdown>
      </ButtonGroup>
    );
  }
}
