import { NavLink } from 'react-router-dom';
import { Panel, PanelGroup } from 'react-bootstrap';
import { setItem as setSessionStorageItem } from 'utils/sessionStorageShare';
import cs from './LeftMenu.less';
import { MENUS } from 'utils/settingMenu';
import { Menu, Icon } from 'lean-ui';

export default class LeftMenu extends PureComponent {
  constructor(props) {
    super(props);
    const {
      location: { pathname },
      match: { path }
    } = props;
    let submenuActiveKey = pathname.replace(path, '').split('/')[1];
    // 控制三级菜单是否展开
    let threemenuActiveKey = '';
    if (
      [
        'transactionRuleSetting',
        'depositRuleSetting',
        'profitRuleSetting',
        'feeReturnsRuleSetting'
      ].some(el => {
        return pathname.indexOf(el) !== -1;
      })
    ) {
      threemenuActiveKey = 'level';
      this.toggle = false;
    }
    const activeKey = pathname;
    this.state = {
      threemenuActiveKey,
      show: true,
      submenuActiveKey,
      activeKey,
      menus: MENUS
    };
  }

  componentWillReceiveProps(props) {
    const {
      location: { pathname },
      match: { path }
    } = props;
    const submenuActiveKey = pathname.replace(path, '').split('/')[1];
    const activeKey = pathname;
    this.setState({
      submenuActiveKey,
      activeKey
    });
  }
  componentDidMount = () => {
    const { getBrandInfo } = this.props;
    Promise.resolve(getBrandInfo()).then(res => {
      if (res.result) {
        this.setState({
          menus: this.parsedMenus()
        });
      }
    });
  };

  setMenuActiveIndex = activeIndex => {
    setSessionStorageItem({ ActiveIndex: activeIndex });
  };

  parsedMenus = () => {
    const { userRights, brandInfo } = this.props;
    const menus = MENUS.concat().filter(menu => userRights[menu.right]);

    menus.forEach(menu => {
      if (menu.submenus) {
        menu.submenus = menu.submenus.filter(submenu => {
          if (submenu.right === undefined) return true;
          return userRights[submenu.right];
        });
      }
    });
    menus.forEach(menu => {
      if (menu.submenus) {
        menu.submenus = menu.submenus.filter(submenu => {
          if (!submenu.mode) return true;
          if (submenu.mode && submenu.mode === brandInfo.mode) return true;
        });
      }
    });
    return menus;
  };

  onSelect = ({ key }) => {
    this.props.history.push(key);
    this.setState({
      activeKey: key
    });
  };

  _renderHeader = menu => {
    return (
      <div>
        <span className={`fa fa-${menu.icon}`} />
        <span className="text">{menu.label}</span>
        <i className="fa fa-angle-down" />
      </div>
    );
  };

  _renderHeaderLink = (menu, idx) => {
    const {
      match: { path }
    } = this.props;
    return (
      <Menu.Item key={`${path}${menu.link}`}>
        <Icon fontType="bw" icon={menu.icon} className={cs['icon']} />
        {menu.label}
      </Menu.Item>
    );
  };

  //  一级菜单Submenu点击事件
  menuItemClick = ({ key }) => {
    this.setState({
      submenuActiveKey: key
    });
  };
  toggle = true;
  //  二级菜单Submenu点击事件
  submenuItemClick = ({ key }) => {
    this.setState({
      threemenuActiveKey: this.toggle ? key : ''
    });
    this.toggle = !this.toggle;
  };
  //  渲染二级菜单
  _renderSubMenu = (activeIndex, item, idx) => {
    const {
      match: { path }
    } = this.props;
    if (item.submenus) {
      return (
        <Menu.SubMenu
          key={item.category}
          onTitleClick={this.submenuItemClick}
          title={item.label}
        >
          {item.submenus.map(this._renderSubMenu.bind(this, idx))}
        </Menu.SubMenu>
      );
    } else {
      let result = item.directLink ? (
        <a
          href={item.link}
          onClick={this.setMenuActiveIndex.bind(this, activeIndex)}
        >
          {item.label}
        </a>
      ) : (
        <Menu.Item key={`${path}${item.link}`}>{item.label}</Menu.Item>
      );
      return result;
    }
  };

  //  渲染一级菜单
  _renderMenu = (menu, idx) => {
    return menu.submenus ? (
      <Menu.SubMenu
        key={menu.category}
        onTitleClick={this.menuItemClick}
        title={
          <span>
            <Icon fontType="bw" icon={menu.icon} className={cs['icon']} />
            {menu.label}
          </span>
        }
      >
        {menu.submenus.map(this._renderSubMenu.bind(this, idx))}
      </Menu.SubMenu>
    ) : (
      this._renderHeaderLink(menu, idx)
    );
  };
  onToggle = () => {
    this.setState(state => {
      return {
        show: !state.show
      };
    });
  };
  render() {
    const {
      activeKey,
      submenuActiveKey,
      threemenuActiveKey,
      menus,
      show
    } = this.state;
    return (
      <div
        className={`${cs['left-menu']} ${cs['left-menu-relative']} ${
          show ? '' : cs['menu-close']
        }`}
      >
        <div className={cs.menuWrapper}>
          <Menu
            mode="inline"
            openKeys={[submenuActiveKey, threemenuActiveKey]}
            onClick={this.onSelect}
            selectedKeys={[activeKey]}
            className="left-menu-container"
          >
            {menus.map(this._renderMenu)}
          </Menu>
        </div>
        <div className={cs['sider-arrow']} onClick={this.onToggle}>
          <div className={cs['arrow-trigger']}>
            <Icon icon={show ? 'arrow-left' : 'arrow-right'} />
          </div>
        </div>
      </div>
    );
  }
}
