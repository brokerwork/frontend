import * as React from 'react';
import * as PropTypes from 'prop-types';
import { SubMenu as RcSubMenu } from 'rc-menu';
import * as classNames from 'classnames';

class SubMenu extends React.Component<any, any> {
  static contextTypes = {
    leanMenuTheme: PropTypes.string,
  };
  static isSubMenu = 1;
  private subMenu: any;
  onKeyDown = (e: React.MouseEvent<HTMLElement>) => {
    this.subMenu.onKeyDown(e);
  }
  saveSubMenu = (subMenu: any) => {
    this.subMenu = subMenu;
  }
  render() {
    const { rootPrefixCls, className } = this.props;
    const theme = this.context.leanMenuTheme;
    return (
      <RcSubMenu
        {...this.props}
        ref={this.saveSubMenu}
        popupClassName={classNames(`${rootPrefixCls}-${theme}`, className)}
      />
    );
  }
}

export default SubMenu;
