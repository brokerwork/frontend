import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import TextArea from "./TextArea";
import omit from "omit.js";
import Icon from "../Icon";

const prefixCls = "lean";
const fn = () => {};

export interface AllInputProps {
  /** 默认占位字符 */
  placeholder?: string;
  /** 输入框内容 */
  value?: any;
  /** input框className */
  className?: string;
  /** 输入框默认内容 */
  defaultValue?: any;
  /** 是否禁用 默认false */
  disabled?: boolean;
  /** 控件样式 */
  style?: React.CSSProperties;
  /** 按下回车的回调 */
  onPressEnter?: React.FormEventHandler<HTMLInputElement>;
  onChange?: React.EventHandler<any>;
  onFocus?: React.EventHandler<any>;
  onBlur?: React.EventHandler<any>;
  onMouseDown?: React.EventHandler<any>;
  tabIndex?: number;
  maxLength?: number;
  autoFocus?: boolean;
}
export interface InputProps extends AllInputProps {
  /** 校验错误信息 */
  errorText?: string;
  /** 校验错误 */
  haserror?: boolean;
  /** 输入框的id */
  id?: number | string;
  /** input框内部前缀 */
  prefix?: React.ReactNode;
  /** input框内部后缀 */
  suffix?: React.ReactNode;
  /** input框type属性 */
  type?: "text" | "password";
  /** input框前置标签 */
  addonAfter?: React.ReactNode;
  /** input框后置标签 */
  addonBefore?: React.ReactNode;
  /** 类似 material design 的下划线输入框 */
  line?: boolean;
  /** 控件尺寸 */
  size?: "large" | "default" | "small";
}

class Input extends React.Component<InputProps, any> {
  static TextArea: typeof TextArea;

  static defaultProps = {
    type: "text",
    disabled: false,
    haserror: false
  };

  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.any,
    type: PropTypes.oneOf(["text", "password"]),
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    disabled: PropTypes.bool,
    addonAfter: PropTypes.node,
    addonBefore: PropTypes.node,
    className: PropTypes.string,
    defaultValue: PropTypes.any,
    errorText: PropTypes.string,
    haserror: PropTypes.bool,
    onPressEnter: PropTypes.func,
    line: PropTypes.bool,
    size: PropTypes.oneOf(["small", "large", "default"])
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { onPressEnter } = this.props;
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e);
    }
  };

  //  获取input框的className
  getInputCls = () => {
    const { size, line, disabled } = this.props;
    return classNames(`${prefixCls}-input`, {
      [`${prefixCls}-input-sm`]: size === "small",
      [`${prefixCls}-input-lg`]: size === "large",
      [`${prefixCls}-input-disabled`]: disabled,
      [`${prefixCls}-input-line`]: !!line
    });
  };

  //  渲染前后控件
  renderAddonInput(children: React.ReactElement<any>) {
    const { props } = this;
    if (!props.addonBefore && !props.addonAfter) {
      return children;
    }
    const addonClassName = `${prefixCls}-input-group-addon`;
    const addonBefore = props.addonBefore ? (
      <span className={addonClassName}>{props.addonBefore}</span>
    ) : null;
    const addonAfter = props.addonAfter ? (
      <span className={addonClassName}>{props.addonAfter}</span>
    ) : null;

    const wrapperClassName = `${prefixCls}-input-group`;
    const className = classNames(`${prefixCls}-input-wrapper`, {
      [wrapperClassName]: addonBefore || addonAfter
    });
    const groupClassName = classNames(`${prefixCls}-input-group-wrapper`, {
      [`${prefixCls}-input-group-wrapper-sm`]: props.size === "small",
      [`${prefixCls}-input-group-wrapper-lg`]: props.size === "large"
    });

    if (addonBefore || addonAfter) {
      return (
        <span className={groupClassName} style={props.style}>
          <span className={className}>
            {addonBefore}
            {React.cloneElement(children, { style: null })}
            {addonAfter}
          </span>
        </span>
      );
    }
    return (
      <span className={className}>
        {addonBefore}
        {children}
        {addonAfter}
      </span>
    );
  }

  //  渲染前后图标
  renderIconInput(children: React.ReactElement<any>) {
    const { props } = this;
    if (!("prefix" in props || "suffix" in props)) {
      return children;
    }
    const prefix = props.prefix ? (
      <span className={`${prefixCls}-input-prefix`}>{props.prefix}</span>
    ) : null;
    const suffix = props.suffix ? (
      <span className={`${prefixCls}-input-suffix`}>{props.suffix}</span>
    ) : null;
    const affixCls = classNames(props.className, `${prefixCls}-input-affix`);
    return (
      <span style={props.style} className={affixCls}>
        {prefix}
        {React.cloneElement(children, {
          style: null,
          className: this.getInputCls()
        })}
        {suffix}
      </span>
    );
  }

  renderInput() {
    const { size, value, disabled, className, autoFocus } = this.props;
    const otherProps = omit(this.props, [
      "size",
      "suffix",
      "prefix",
      "errorText",
      "addonAfter",
      "addonBefore",
      "onPressEnter",
      "haserror"
    ]);
    if ("value" in this.props) {
      if (typeof value === "undefined" || value === null) {
        otherProps.value = "";
      } else {
        otherProps.value = value;
      }
      delete otherProps.defaultValue;
    }
    return this.renderIconInput(
      <input
        {...otherProps}
        className={classNames(this.getInputCls(), className)}
        onKeyDown={this.handleKeyDown}
        autoFocus={autoFocus}
      />
    );
  }

  render() {
    const { errorText, haserror } = this.props;
    const errorClassName =
      !!errorText || haserror ? `${prefixCls}-input-has-error` : null;
    return (
      <span className={errorClassName}>
        {this.renderAddonInput(this.renderInput())}
        {!!errorText ? (
          <div className={`${prefixCls}-input-error`}>
            <Icon icon="warning" />
            <span className={`${prefixCls}-input-error-text`}>{errorText}</span>
          </div>
        ) : null}
      </span>
    );
  }
}
Input.TextArea = TextArea;

export default Input;
