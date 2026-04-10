import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import RcCheckbox from "rc-checkbox";
import * as shallowEqual from "shallowequal";
import CheckboxGroup, { CheckboxGroupContext } from "./Group";

const prefix = "lean";

export interface AbstractCheckboxProps<T> {
  className?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (e: T) => void;
  onMouseEnter?: React.MouseEventHandler<any>;
  onMouseLeave?: React.MouseEventHandler<any>;
  onKeyPress?: React.KeyboardEventHandler<any>;
  onKeyDown?: React.KeyboardEventHandler<any>;
  value?: any;
  tabIndex?: number;
  name?: string;
  children?: React.ReactNode;
}

export interface CheckboxProps
  extends AbstractCheckboxProps<CheckboxChangeEvent> {
  indeterminate?: boolean;
}

export interface CheckboxChangeEventTarget extends CheckboxProps {
  checked: boolean;
}

export interface CheckboxChangeEvent {
  target: CheckboxChangeEventTarget;
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: MouseEvent;
}

export default class Checkbox extends React.Component<CheckboxProps, {}> {
  static Group: typeof CheckboxGroup;
  static defaultProps = {
    indeterminate: false
  };

  static contextTypes = {
    checkboxGroup: PropTypes.any
  };

  private rcCheckbox: any;

  shouldComponentUpdate(
    nextProps: CheckboxProps,
    nextState: {},
    nextContext: CheckboxGroupContext
  ) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState) ||
      !shallowEqual(this.context.checkboxGroup, nextContext.checkboxGroup)
    );
  }

  focus() {
    this.rcCheckbox.focus();
  }

  blur() {
    this.rcCheckbox.blur();
  }

  saveCheckbox = (node: any) => {
    this.rcCheckbox = node;
  };

  render() {
    const { props, context } = this;
    const {
      className,
      children,
      indeterminate,
      style,
      onMouseEnter,
      onMouseLeave,
      ...restProps
    } = props;
    const { checkboxGroup } = context;
    let checkboxProps: CheckboxProps = { ...restProps };
    if (checkboxGroup) {
      checkboxProps.onChange = () =>
        checkboxGroup.toggleOption({ label: children, value: props.value });
      checkboxProps.checked = checkboxGroup.value.indexOf(props.value) !== -1;
      checkboxProps.disabled = props.disabled || checkboxGroup.disabled;
    }
    const classString = classNames(className, {
      [`${prefix}-checkbox-wrapper`]: true
    });
    const checkboxClass = classNames({
      [`${prefix}-checkbox-indeterminate`]: indeterminate,
    });
    return (
      <label
        className={classString}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <RcCheckbox
          {...checkboxProps}
          prefixCls={`${prefix}-checkbox`}
          className={checkboxClass}
          ref={this.saveCheckbox}
        />
        {children !== undefined ? <span>{children}</span> : null}
      </label>
    );
  }
}
