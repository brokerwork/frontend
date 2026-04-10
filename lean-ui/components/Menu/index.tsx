import * as React from 'react';
import { findDOMNode } from 'react-dom';
import RcMenu, { Divider, ItemGroup } from 'rc-menu';
import * as PropTypes from 'prop-types';
import * as classNames from 'classnames';
import animation from '../utils/openAnimation';
import warning from '../utils/warning';
import SubMenu from './SubMenu';
import Item from './MenuItem';

const theme = 'light';
export interface SelectParam {
  key: string;
  keyPath: Array<string>;
  item: any;
  domEvent: any;
  selectedKeys: Array<string>;
}

export interface ClickParam {
  key: string;
  keyPath: Array<string>;
  item: any;
  domEvent: any;
}

export type MenuMode =
  | 'vertical'
  | 'vertical-left'
  | 'vertical-right'
  | 'horizontal'
  | 'inline';

export interface MenuProps {
  id?: string;
  // theme?: 'light' | 'dark';
  mode?: MenuMode;
  selectable?: boolean;
  selectedKeys?: Array<string>;
  defaultSelectedKeys?: Array<string>;
  openKeys?: Array<string>;
  defaultOpenKeys?: Array<string>;
  onOpenChange?: (openKeys: string[]) => void;
  onSelect?: (param: SelectParam) => void;
  onDeselect?: (param: SelectParam) => void;
  onClick?: (param: ClickParam) => void;
  style?: React.CSSProperties;
  openAnimation?: string | Object;
  openTransitionName?: string | Object;
  className?: string;
  prefixCls?: string;
  multiple?: boolean;
  inlineIndent?: number;
  inlineCollapsed?: boolean;
  subMenuCloseDelay?: number;
  subMenuOpenDelay?: number;
  triggerSubMenuAction?: 'click' | 'hover';
}

export interface MenuState {
  openKeys: string[];
}

export default class Menu extends React.Component<MenuProps, MenuState> {
  static Divider = Divider;
  static Item = Item;
  static SubMenu = SubMenu;
  static ItemGroup = ItemGroup;
  static defaultProps = {
    prefixCls: 'lean-menu',
    className: '',
    triggerSubMenuAction: 'hover'
    // theme: 'light',  // or dark
  };

  static contextTypes = {
    siderCollapsed: PropTypes.bool,
    collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  static childContextTypes = {
    inlineCollapsed: PropTypes.bool,
    leanMenuTheme: PropTypes.string
  };

  static propTypes = {
    id: PropTypes.string,
    // theme: PropTypes.string,
    mode: PropTypes.oneOf([
      'vertical',
      'vertical-left',
      'vertical-right',
      'horizontal',
      'inline'
    ]),
    selectable: PropTypes.bool,
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    openKeys: PropTypes.arrayOf(PropTypes.string),
    defaultOpenKeys: PropTypes.arrayOf(PropTypes.string),
    onOpenChange: PropTypes.func,
    onSelect: PropTypes.func,
    onDeselect: PropTypes.func,
    onClick: PropTypes.func,
    style: PropTypes.object,
    openAnimation: PropTypes.oneOfType([PropTypes.string | PropTypes.object]),
    openTransitionName: PropTypes.oneOfType([
      PropTypes.string | PropTypes.object
    ]),
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    multiple: PropTypes.bool,
    inlineIndent: PropTypes.number,
    inlineCollapsed: PropTypes.bool,
    subMenuCloseDelay: PropTypes.number,
    subMenuOpenDelay: PropTypes.number,
    triggerSubMenuAction: PropTypes.oneOf(['click', 'hover'])
  };
  switchModeFromInline: boolean;
  leaveAnimationExecutedWhenInlineCollapsed: boolean;
  inlineOpenKeys: string[] = [];
  constructor(props: MenuProps) {
    super(props);

    let openKeys;
    if ('defaultOpenKeys' in props) {
      openKeys = props.defaultOpenKeys;
    } else if ('openKeys' in props) {
      openKeys = props.openKeys;
    }

    this.state = {
      openKeys: openKeys || []
    };
  }
  getChildContext() {
    return {
      inlineCollapsed: this.getInlineCollapsed(),
      leanMenuTheme: theme
    };
  }
  componentWillReceiveProps(nextProps: MenuProps) {
    const { prefixCls } = this.props;
    if (this.props.mode === 'inline' && nextProps.mode !== 'inline') {
      this.switchModeFromInline = true;
    }
    if ('openKeys' in nextProps) {
      this.setState({ openKeys: nextProps.openKeys! });
      return;
    }
    if (nextProps.inlineCollapsed && !this.props.inlineCollapsed) {
      this.switchModeFromInline =
        !!this.state.openKeys.length &&
        !!findDOMNode(this).querySelectorAll(`.${prefixCls}-submenu-open`)
          .length;
      this.inlineOpenKeys = this.state.openKeys;
      this.setState({ openKeys: [] });
    }
    if (!nextProps.inlineCollapsed && this.props.inlineCollapsed) {
      this.setState({ openKeys: this.inlineOpenKeys });
      this.inlineOpenKeys = [];
    }
  }
  handleClick = (e: ClickParam) => {
    this.handleOpenChange([]);

    const { onClick } = this.props;
    if (onClick) {
      onClick(e);
    }
  };
  handleOpenChange = (openKeys: string[]) => {
    this.setOpenKeys(openKeys);

    const { onOpenChange } = this.props;
    if (onOpenChange) {
      onOpenChange(openKeys);
    }
  };
  setOpenKeys(openKeys: string[]) {
    if (!('openKeys' in this.props)) {
      this.setState({ openKeys });
    }
  }
  getRealMenuMode() {
    const inlineCollapsed = this.getInlineCollapsed();
    if (this.switchModeFromInline && inlineCollapsed) {
      return 'inline';
    }
    const { mode } = this.props;
    return inlineCollapsed ? 'vertical' : mode;
  }
  getInlineCollapsed() {
    const { inlineCollapsed } = this.props;
    if (this.context.siderCollapsed !== undefined) {
      return this.context.siderCollapsed;
    }
    return inlineCollapsed;
  }
  getMenuOpenAnimation(menuMode: MenuMode) {
    const { openAnimation, openTransitionName } = this.props;
    let menuOpenAnimation = openAnimation || openTransitionName;
    if (openAnimation === undefined && openTransitionName === undefined) {
      switch (menuMode) {
        case 'horizontal':
          menuOpenAnimation = 'slide-up';
          break;
        case 'vertical':
        case 'vertical-left':
        case 'vertical-right':
          // When mode switch from inline
          // submenu should hide without animation
          if (this.switchModeFromInline) {
            menuOpenAnimation = '';
            this.switchModeFromInline = false;
          } else {
            menuOpenAnimation = 'zoom-big';
          }
          break;
        case 'inline':
          menuOpenAnimation = {
            ...animation,
            leave: (node: HTMLElement, done: () => void) =>
              animation.leave(node, () => {
                // Make sure inline menu leave animation finished before mode is switched
                this.switchModeFromInline = false;
                this.setState({});
                // when inlineCollapsed change false to true, all submenu will be unmounted,
                // so that we don't need handle animation leaving.
                if (this.getRealMenuMode() === 'vertical') {
                  return;
                }
                done();
              })
          };
          break;
        default:
      }
    }
    return menuOpenAnimation;
  }

  render() {
    const { prefixCls, className } = this.props;
    const menuMode = this.getRealMenuMode();
    const menuOpenAnimation = this.getMenuOpenAnimation(menuMode!);

    const menuClassName = classNames(className, `${prefixCls}-${theme}`, {
      [`${prefixCls}-inline-collapsed`]: this.getInlineCollapsed()
    });

    const menuProps: MenuProps = {
      openKeys: this.state.openKeys,
      onOpenChange: this.handleOpenChange,
      className: menuClassName,
      mode: menuMode
    };

    if (menuMode !== 'inline') {
      // closing vertical popup submenu after click it
      menuProps.onClick = this.handleClick;
      menuProps.openTransitionName = menuOpenAnimation;
    } else {
      menuProps.openAnimation = menuOpenAnimation;
    }

    // https://github.com/ant-design/ant-design/issues/8587
    const { collapsedWidth } = this.context;
    if (
      this.getInlineCollapsed() &&
      (collapsedWidth === 0 ||
        collapsedWidth === '0' ||
        collapsedWidth === '0px')
    ) {
      return null;
    }

    return <RcMenu {...this.props} {...menuProps} />;
  }
}
