import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import Icon from "../Icon";

const prefix = "lean-tag";

export interface TagProps {
  color?:
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "pink"
    | "green"
    | "grey"
    | "default";
  onCloseClick?: React.FormEventHandler<any>;
  onClick?: React.FormEventHandler<any>;
  closeable?: boolean;
  className?: string;
  newTag?: boolean;
}

class Tag extends React.Component<TagProps, any> {
  static defaultProps = {
    color: "default"
  };
  static propTypes = {
    color: PropTypes.oneOf([
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "pink",
      "green",
      "grey",
      "default"
    ]),
    newTag: PropTypes.bool,
    onClick: PropTypes.func,
    onCloseClick: PropTypes.func,
    className: PropTypes.string,
    closeable: PropTypes.bool
  };
  render() {
    const {
      children,
      closeable,
      className,
      onClick,
      color,
      newTag,
      onCloseClick,
      ...others
    } = this.props;
    const cls = classNames(prefix, className, {
      [`${prefix}-${color}`]: true,
      [`${prefix}-new`]: newTag
    });
    return (
      <div className={cls} onClick={onClick} {...others}>
        {newTag && <Icon className="add-icon" icon="add-outline" />}
        {children && <span>{children}</span>}
        {closeable && (
          <Icon className="close-icon" icon="close" onClick={onCloseClick} />
        )}
      </div>
    );
  }
}
export default Tag;
