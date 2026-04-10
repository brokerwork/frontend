import * as React from "react";
import * as PropTypes from "prop-types";

export interface PagerProps {
  locale?: any;
  last?: boolean;
  rootPrefixCls?: string;
  page?: number;
  active?: boolean;
  className?: any;
  onClick?: (page: number) => void;
  onKeyPress?: (
    event: any,
    onClick: (page: number) => void,
    page: number
  ) => void;
  showTitle?: boolean;
  itemRender?: (
    page: number,
    type: "page" | "prev" | "next" | "jump-prev" | "jump-next",
    element?: React.ReactNode
  ) => React.ReactNode;
}

class Pager extends React.Component<PagerProps, {}> {
  static propTypes = {
    page: PropTypes.number,
    active: PropTypes.bool,
    last: PropTypes.bool,
    locale: PropTypes.object,
    className: PropTypes.string,
    showTitle: PropTypes.bool,
    rootPrefixCls: PropTypes.string,
    onClick: PropTypes.func,
    onKeyPress: PropTypes.func,
    itemRender: PropTypes.func
  };
  handleClick = () => {
    const { onClick, page } = this.props;
    onClick(page);
  };

  handleKeyPress = (e: any) => {
    const { onKeyPress, onClick, page } = this.props;
    onKeyPress(e, onClick, page);
  };
  render() {
    const props = this.props;
    const prefixCls = `${props.rootPrefixCls}-item`;
    let cls = `${prefixCls} ${prefixCls}-${props.page}`;

    if (props.active) {
      cls = `${cls} ${prefixCls}-active`;
    }

    if (props.className) {
      cls = `${cls} ${props.className}`;
    }

    return (
      <li
        title={props.showTitle ? `${props.page}` : null}
        className={cls}
        onClick={this.handleClick}
        onKeyPress={this.handleKeyPress}
        data-tab-index="0"
      >
        {props.itemRender(props.page, "page", <a>{props.page}</a>)}
      </li>
    );
  }
}

export default Pager;
