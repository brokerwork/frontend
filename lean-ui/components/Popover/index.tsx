import * as React from "react";
import Tooltip, { AbstractTooltipProps } from "../Tooltip";
import warning from "../utils/warning";

export interface PopoverProps extends AbstractTooltipProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  [t: string]: any;
}

export default class Popover extends React.Component<PopoverProps, {}> {
  static defaultProps = {
    prefixCls: "lean-popover",
    placement: "top",
    transitionName: "zoom-big",
    trigger: "hover",
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    overlayStyle: {}
  };

  private tooltip: Tooltip;

  getPopupDomNode() {
    return this.tooltip.getPopupDomNode();
  }

  getOverlay() {
    const { title, prefixCls, content } = this.props;
    warning(
      !("overlay" in this.props),
      "Popover[overlay] is removed, please use Popover[content] instead, " +
        "see: https://u.ant.design/popover-content"
    );
    return (
      <div>
        {title && <div className={`${prefixCls}-title`}>{title}</div>}
        <div className={`${prefixCls}-inner-content`}>{content}</div>
      </div>
    );
  }

  saveTooltip = (node: any) => {
    this.tooltip = node;
  };

  render() {
    if (!this.props.content) {
      return this.props.children;
    }
    const props = { ...this.props };
    delete props.title;
    return (
      <Tooltip {...props} ref={this.saveTooltip} overlay={this.getOverlay()} />
    );
  }
}
