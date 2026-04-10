import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import Icon from "../Icon";

const prefix = "lean-form";

export interface FormItemProps {
  required?: boolean;
  className?: string;
  col?: 1 | 2;
  errorMsg?: string;
}
export const FormItem: React.SFC<FormItemProps> = ({
  children,
  className,
  required,
  errorMsg,
  col
}) => {
  const cls = classNames(`${prefix}-item`, className, {
    [`${prefix}-item-required`]: required,
    [`${prefix}-item-${col}`]: Boolean(col)
  });
  return (
    <div className={cls}>
      {children}
      {Boolean(errorMsg) && (
        <div className={`${prefix}-error-msg`}>
          <Icon icon="warning" className={`${prefix}-error-icon`} /> {errorMsg}
        </div>
      )}
    </div>
  );
};

export interface FormLabelProps {
  className?: string;
}
export const FormLabel: React.SFC<FormLabelProps> = ({
  className,
  children
}) => {
  const cls = classNames(`${prefix}-label`, className);
  return <div className={cls}>{children}</div>;
};

export interface FormControlProps {
  className?: string;
  errorMsg?: string;
}
export const FormControl: React.SFC<FormControlProps> = ({
  children,
  errorMsg,
  className
}) => {
  const cls = classNames(`${prefix}-control`, className);
  return (
    <div className={cls}>
      {children}
      {Boolean(errorMsg) && (
        <div className={`${prefix}-error-msg`}>
          <Icon icon="warning" className={`${prefix}-error-icon`} /> {errorMsg}
        </div>
      )}
    </div>
  );
};

export interface FormProps {
  className?: string;
  horizontal?: boolean;
}
class Form extends React.Component<FormProps, any> {
  static Item: typeof FormItem;
  static Label: typeof FormLabel;
  static Control: typeof FormControl;
  render() {
    const { children, className, horizontal } = this.props;
    const cls = classNames(prefix, className, {
      [`${prefix}-horizontal`]: horizontal
    });
    return <div className={cls}>{children}</div>;
  }
}

Form.Item = FormItem;
Form.Label = FormLabel;
Form.Control = FormControl;

export default Form;
