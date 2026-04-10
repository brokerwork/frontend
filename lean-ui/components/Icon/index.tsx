import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import iconFontPathData from "./iconFontPath";

export interface IconProps {
  className?: string;
  onClick?: React.FormEventHandler<any>;
  fontType?: string;
  icon: string;
}

const prefix = "lean";
const iconPrefix = "icon-lw";
const fn = () => {};

const fontTypeObj: any = {
  [iconPrefix]: iconFontPathData
};

export const addFontType = (type: string, pathData: any) => {
  fontTypeObj[type] = pathData;
};

class Icon extends React.Component<IconProps, any> {
  static defaultProps = {
    onClick: fn
  };
  static addFontType = addFontType;
  static propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    fontType: PropTypes.string
  };
  render() {
    const {
      icon,
      className,
      fontType = iconPrefix,
      onClick,
      ...others
    } = this.props;
    const cls = classNames(className, {
      [`${fontType}-${icon}`]: true
    });
    const pathData = fontTypeObj[fontType];
    if (pathData && pathData[icon]) {
      return (
        <span className={cls} onClick={onClick} {...others}>
          {pathData[icon].map((item: string, index: number) => (
            <span className={item} key={index} />
          ))}
        </span>
      );
    }
    return <span className={cls} onClick={onClick}>
      <span className="path1" />
      <span className="path2" />
    </span>;
  }
}
export default Icon;
