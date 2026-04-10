import * as React from "react";
import * as ReactDOM from "react-dom";
import Animate from "rc-animate";
import Icon from "../Icon";
import * as classNames from "classnames";
import * as PropTypes from "prop-types";
const closeText = "";
function noop() {}

export interface AlertProps {
  /**
   * Type of Alert styles, options:`success`, `info`, `warning`, `error`
   */
  type?: "success" | "info" | "warning" | "error";
  /** Whether Alert can be closed */
  closable?: boolean;
  /** Close text to show */
  // closeText?: React.ReactNode;
  /** Content of Alert */
  message: React.ReactNode;
  /** Additional content of Alert */
  description?: React.ReactNode;
  /** Callback when close Alert */
  onClose?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Trigger when animation ending of Alert */
  afterClose?: () => void;
  /** Whether to show icon */
  showIcon?: boolean;
  iconType?: string;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
  banner?: boolean;
}

export default class Alert extends React.Component<AlertProps, any> {
  static propTypes = {
    type: PropTypes.string,
    /** Whether Alert can be closed */
    closable: PropTypes.bool,
    /** Close text to show */
    // closeText: PropTypes.object,
    /** Content of Alert */
    message: PropTypes.object,
    /** Additional content of Alert */
    description: PropTypes.object,
    /** Callback when close Alert */
    onClose: PropTypes.func,
    /** Trigger when animation ending of Alert */
    afterClose: PropTypes.func,
    /** Whether to show icon */
    showIcon: PropTypes.bool,
    iconType: PropTypes.string,
    style: PropTypes.object,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    banner: PropTypes.bool
  };

  static defaultProps = {
    banner: true,
    showIcon:true,
    closable: true,
    // showIcon: false
    prefixCls: 'lean-alert',
    type: "info"
  };

  constructor(props: AlertProps) {
    super(props);
    this.state = {
      closing: true,
      closed: false
    };
  }
  handleClose = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let dom = ReactDOM.findDOMNode(this) as HTMLElement;
    dom.style.height = `${dom.offsetHeight}px`;
    // Magic code
    // 重复一次后才能正确设置 height
    dom.style.height = `${dom.offsetHeight}px`;

    this.setState({
      closing: false
    });
    (this.props.onClose || noop)(e);
  };
  animationEnd = () => {
    this.setState({
      closed: true,
      closing: true
    });
    (this.props.afterClose || noop)();
  };
  render() {
    let {
      closable,
      description,
      type,
      prefixCls,
      message,
      showIcon,
      banner,
      className = "",
      style,
      iconType
    } = this.props;

    // banner模式默认有 Icon
    showIcon = banner && showIcon === undefined ? true : showIcon;
    // banner模式默认为警告
    type = banner && type === undefined ? "warning" : type || "info";

    if (!iconType) {
      switch (type) {
        case "success":
          iconType = "success";
          break;
        case "info":
          iconType = "info";
          break;
        case "error":
          iconType = "error";
          break;
        case "warning":
          iconType = "warning";
          break;
        default:
          iconType = "default";
      }

      // use outline icon in alert with description
      if (!!description) {
        iconType += "-o";
      }
    }

    let alertCls = classNames(
      prefixCls,
      {
        [`${prefixCls}-${type}`]: true,
        [`${prefixCls}-close`]: !this.state.closing,
        [`${prefixCls}-with-description`]: !!description,
        [`${prefixCls}-no-icon`]: !showIcon,
        [`${prefixCls}-banner`]: !!banner
      },
      className
    );

    // closeable when closeText is assigned
    if (closeText) {
      closable = true;
    }

    const closeIcon = closable ? (
      <a onClick={this.handleClose} className={`${prefixCls}-close-icon`}>
        {closeText || <Icon icon="close" />}
      </a>
    ) : null;

    return this.state.closed ? null : (
      <Animate
        component=""
        showProp="data-show"
        transitionName={`${prefixCls}-slide-up`}
        onEnd={this.animationEnd}
      >
        <div data-show={this.state.closing} className={alertCls} style={style}>
          {showIcon ? (
            <Icon className={`${prefixCls}-icon`} icon={iconType} />
          ) : null}
          <span className={`${prefixCls}-message`}>{message}</span>
          <span className={`${prefixCls}-description`}>{description}</span>
          {closeIcon}
        </div>
      </Animate>
    );
  }
}
