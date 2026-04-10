import { connect } from 'react-redux';
import { getMenu, getCustomPlatformMenus } from 'common/actions';
import { NavLink } from 'react-router-dom';
import Accordion from 'components/Accordion';
import cs from './Container.less';
import { getTenantId } from 'utils/tenantInfo';

class Menu extends PureComponent {
  componentDidMount() {
    const { getMenu, getCustomPlatformMenus } = this.props;

    getMenu();
    getCustomPlatformMenus();
  }

  _renderSubMenu = (activeKey, menu, idx) => {
    const {
      location: { pathname },
      versionRights = {}
    } = this.props;

    //版本控制
    if (menu.versionRight && !versionRights[menu.versionRight]) {
      return null;
    }

    const subActiveKey = `${activeKey}-${pathname.split('/')[3]}`;

    return (
      <li key={idx}>
        <Accordion activeKey={subActiveKey}>
          <Accordion.Panel
            key={idx}
            header={this._renderHeader(menu)}
            eventKey={menu.eventKey}
            className={cs['menu-panel']}
          >
            {menu.subMenu ? (
              <ul className={cs['sub-menu']}>{menu.subMenu.map(this._renderSubMenu.bind(this, subActiveKey))}</ul>
            ) : (
              undefined
            )}
          </Accordion.Panel>
        </Accordion>
      </li>
    );
  };

  _renderHeader = menu => {
    const icon = menu.iconType === 'icomoon' ? `icon icon-${menu.icon}` : `fa fa-${menu.icon}`;
    const {
      location: { pathname }
    } = this.props;
    const currentModule = pathname.split('/')[1];
    return (
      <div>
        {menu.link ? (
          menu.module !== currentModule ? (
            <a className={cs['menu-header']} href={`${window.location.origin}${menu.link}?tenantId=${getTenantId()}`}>
              {menu.icon ? <i className={`${icon} ${cs['menu-icon']}`} /> : undefined}
              <span className={cs['menu-text']}>{menu.label}</span>
            </a>
          ) : (
            <NavLink
              className={cs['menu-header']}
              to={{ pathname: menu.link, search: `?tenantId=${getTenantId()}` }}
              activeClassName="active"
            >
              {menu.icon ? <i className={`${icon} ${cs['menu-icon']}`} /> : undefined}
              <span className={cs['menu-text']}>{menu.label}</span>
            </NavLink>
          )
        ) : (
          <div className={cs['menu-header']}>
            {menu.icon ? <i className={`${icon} ${cs['menu-icon']}`} /> : undefined}
            <span className={cs['menu-text']}>{menu.label}</span>
            <i className={`fa fa-angle-down ${cs['menu-arrow']}`} />
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      menus,
      location: { pathname }
    } = this.props;
    const strings = pathname.split('/');
    const activeKey = strings[1] === 'home' ? strings[2] : strings[1];
    return (
      <div className={cs['menu']}>
        <Accordion activeKey={activeKey}>
          {menus.map((menu, idx) => {
            return (
              <Accordion.Panel
                key={idx}
                header={this._renderHeader(menu)}
                eventKey={menu.eventKey}
                className={cs['menu-panel']}
              >
                {menu.subMenu ? (
                  <ul className={cs['sub-menu']}>{menu.subMenu.map(this._renderSubMenu.bind(this, activeKey))}</ul>
                ) : (
                  undefined
                )}
              </Accordion.Panel>
            );
          })}
        </Accordion>
      </div>
    );
  }
}

export default connect(
  ({ common: { menus, versionRights } }) => ({
    menus,
    versionRights
  }),
  {
    getMenu,
    getCustomPlatformMenus
  }
)(Menu);
