import * as React from "react";
import RcDropdown from "rc-dropdown";
import * as classNames from "classnames";
import DropdownButton from "./dropdown-button";
import warning from "../utils/warning";
import * as PropTypes from "prop-types";

export interface DropDownProps {
  trigger?: ("click" | "hover" | "contextMenu")[];
  overlay: React.ReactNode;
  onVisibleChange?: (visible?: boolean) => void;
  visible?: boolean;
  disabled?: boolean;
  destroyPopupOnHide?: boolean;
  align?: Object;
  overlayClassName?: string;
  getPopupContainer?: (triggerNode: Element) => HTMLElement;
  prefixCls?: string;
  className?: string;
  transitionName?: string;
  placement?:
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight";
  forceRender?: boolean;
}

export default class Dropdown extends React.Component<DropDownProps, any> {
  static Button: typeof DropdownButton;
  static defaultProps = {
    prefixCls: "lean-dropdown",
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0.1,
    placement: "bottomLeft"
  };
  static propTypes = {
    /** 触发方式 */
    trigger: PropTypes.oneOf("click", "hover", "contextMenu"),
    /** 浮出层， 传 react 组件 */
    overlay: PropTypes.node,
    onVisibleChange: PropTypes.func,
    visible: PropTypes.bool,
    /** 禁用 */
    disabled: PropTypes.bool,
    destroyPopupOnHide: PropTypes.bool,
    /** 对齐方式 */
    align: PropTypes.object,
    getPopupContainer: PropTypes.func,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    overlayClassName: PropTypes.string,
    /** 动画名 */
    transitionName: PropTypes.string,
    forceRender: PropTypes.string,
    /** 浮出层位置 "topLeft",
      "topCenter",
      "topRight",
      "bottomLeft",
      "bottomCenter",
      "bottomRight" */
    placement: PropTypes.oneOf(
      "topLeft",
      "topCenter",
      "topRight",
      "bottomLeft",
      "bottomCenter",
      "bottomRight"
    )
  };

  getTransitionName() {
    const { placement = "", transitionName } = this.props;
    if (transitionName !== undefined) {
      return transitionName;
    }
    if (placement.indexOf("top") >= 0) {
      return "slide-down";
    }
    return "slide-up";
  }

  componentDidMount() {
    const { overlay } = this.props;
    const overlayProps = (overlay as any).props as any;
    warning(
      !overlayProps.mode || overlayProps.mode === "vertical",
      `mode="${overlayProps.mode}" is not supported for Dropdown\'s Menu.`
    );
  }

  render() {
    const {
      children,
      prefixCls,
      overlay: overlayElements,
      trigger,
      disabled
    } = this.props;

    const child = React.Children.only(children);
    const overlay = React.Children.only(overlayElements);

    const dropdownTrigger = React.cloneElement(child, {
      className: classNames(child.props.className, `${prefixCls}-trigger`),
      disabled
    });
    // menu cannot be selectable in dropdown defaultly
    const selectable = overlay.props.selectable || false;
    const fixedModeOverlay = React.cloneElement(overlay, {
      mode: "vertical",
      selectable
    });
    return (
      <RcDropdown
        {...this.props}
        transitionName={this.getTransitionName()}
        trigger={disabled ? [] : trigger}
        overlay={fixedModeOverlay}
      >
        {dropdownTrigger}
      </RcDropdown>
    );
  }
}
