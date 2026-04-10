import cs from './header.less';
import { setItem as setSessionStorageItem } from 'utils/sessionStorageShare';
import LanguageSelector from 'components/LanguageSelector';
import DropdownItem from '../DropdownItem';
import IntroduceLink from '../../landings/Usersetting/components/IntroduceLink';
import i18n from 'utils/i18n';
import language from 'utils/language';
import { NavLink as Link, withRouter } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { countryCodeStaticDir, languages } from 'utils/config';
import VersionGuide from '../VersionGuide';
import { MENUS, GET_MENUS_FOR_HEADER } from 'utils/settingMenu';
import { Menu, Badge, Layout, Icon, Dropdown, Dialog, Popover } from 'lean-ui';

import Cookies from 'js-cookie';
import _ from 'lodash';
import { connect } from 'react-redux';
import { initialUsualReportList } from 'commonActions/actions';

const languageType = language.getType();
import {
  FRONT_LATEST_VERSION_STORAGE_KEY,
  CURRENT_USER_VERSION_TYPE_STORAGE_KEY,
  LATEST_OLD_RELEASE_VERSION_STORAGE_KEY,
  CONFIG_VERSION_TYPE_STORAGE_KEY,
  LATEST_OLD_RELEASE_VERSION,
  VERSION_RELEASE,
  VERSION_BETA
} from 'landings/Home/constant';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showMessageList: false,
      switchLogoutModalVisible: false,
      userTools: [
        {
          label: i18n['navigation.user_tools.apply_withdraw'],
          link: '/withdraw',
          id: 'withdraw'
        },
        {
          label: i18n['navigation.user_tools.security_setting'],
          link: '/usersetting/securitySetting',
          id: 'securitySetting'
        },
        {
          label: i18n['navigation.user_tools.user_data'],
          link: '/usersetting/basicinfo',
          id: 'basicinfo'
        },
        {
          label: i18n['navigation.user_tools.user_introducelink'],
          link: '/usersetting/introduceLink',
          id: 'introducelink'
        },
        {
          label: i18n['navigation.user_tools.email_setting'],
          link: '/usersetting/emailsetting',
          id: 'email_setting'
        },
        {
          label: i18n['navigation.user_tools.agent_deposit_detail'],
          link: '/usersetting/mydeposit/NA',
          id: 'mydeposit'
        },
        {
          label: i18n['settings.self_notify.header'],
          link: '/personalNotify',
          id: 'personalNotify'
        },
        {
          label: i18n['navigation.user_tools.logout'],
          id: 'logout'
        },
        ...this.getUiSwitcherItemState()
      ]
    };
  }
  componentDidMount() {
    const { initialUsualReportList } = this.props;
    const usual = localStorage.getItem('usual');
    const usualList = usual && JSON.parse(usual);
    usualList && initialUsualReportList(usualList);
  }

  // 获取UI切换的按钮
  getUiSwitcherItemState = () => {
    // 从缓存中拿去数据
    const uiVersion = window.localStorage[CONFIG_VERSION_TYPE_STORAGE_KEY];
    const currentUserUiVersion =
      window.localStorage[CURRENT_USER_VERSION_TYPE_STORAGE_KEY];
    const frontVersion = window.localStorage[FRONT_LATEST_VERSION_STORAGE_KEY];
    if (uiVersion === VERSION_BETA) {
      // 如果是新建tab的feverion与本地设置的不同，则强制转到本地设置的版本
      if (
        !!currentUserUiVersion &&
        Cookies.get('feVersion') !== currentUserUiVersion
      ) {
        Cookies.set('feVersion', currentUserUiVersion, {
          expires: 3600
        });
        window.location.reload(true);
      }
      // 初始设置为将要切换到新版的状态
      return [
        {
          label:
            currentUserUiVersion == frontVersion
              ? i18n['navigation.user_tools.ui_switcher_return_old']
              : i18n['navigation.user_tools.ui_switcher_exper_new'],
          id: 'uiSwitcher'
        }
      ];
    } else return [];
  };
  getUserTools = () => {
    const { userInfo, personalRules, personalReportShow } = this.props;
    const { userTools } = this.state;
    const copyData = [];
    userTools.forEach(item => {
      if (item.id === 'mydeposit') {
        if (userInfo && userInfo.agent) {
          copyData.push(item);
        }
      } else if (item.id === 'personalNotify') {
        if (
          personalRules.length > 0 ||
          personalReportShow.personalDailyReportEnable
        ) {
          copyData.push(item);
        }
      } else {
        copyData.push(item);
      }
    });
    return copyData;
  };
  userToolsSelect = item => {
    const { getIntroduceLink, logout } = this.props;
    const { id } = item;
    if (id === 'logout') {
      logout().then(() => {
        window.location.href = '/';
      });
    } else if (id === 'uiSwitcher') {
      // 切换UI
      this.setState({
        switchLogoutModalVisible: true
      });
    }
  };
  toggleVisible = () => {
    this.setState({
      switchLogoutModalVisible: !this.state.switchLogoutModalVisible
    });
  };
  // 点击切换UI版本
  toggleUiVersion = id => {
    const { logout } = this.props;
    let currentUserUiVersion =
      window.localStorage[CURRENT_USER_VERSION_TYPE_STORAGE_KEY];
    const frontVersion = window.localStorage[FRONT_LATEST_VERSION_STORAGE_KEY];
    const oldVersion =
      window.localStorage[LATEST_OLD_RELEASE_VERSION_STORAGE_KEY] ||
      LATEST_OLD_RELEASE_VERSION;
    const { userTools } = this.state;
    if (!currentUserUiVersion || currentUserUiVersion == oldVersion) {
      // 如果未设置过，或已经设置为旧版，则设置为新版UI
      currentUserUiVersion = window.localStorage[
        CURRENT_USER_VERSION_TYPE_STORAGE_KEY
      ] = frontVersion;
    } else {
      // 切换为旧版的UI
      currentUserUiVersion = window.localStorage[
        CURRENT_USER_VERSION_TYPE_STORAGE_KEY
      ] = oldVersion;
    }
    // 刷新页面,清除缓存
    logout().then(() => {
      window.location.href = '/';
    });
  };

  setMenuActiveIndex = () => {
    setSessionStorageItem({ ActiveIndex: '0' });
  };

  languageSelect = item => {
    const { setLanguageType } = this.props;
    setLanguageType(item.value);
  };
  renderMenuItem = (item, topLevel, SubMenu, icon) => {
    const content = SubMenu ? (
      <div className={cs['sub-menu-item']}>
        <span className={cs['sub-level']}>{item.label}</span>
        <Badge count={item.todoCount} />
        {icon ? (
          <Icon icon="caret-right" className={cs['right-caret']} />
        ) : (
          undefined
        )}
      </div>
    ) : (
      <Badge dot={item.todoCount > 0} blink={item.todoCount > 0}>
        <span className={topLevel ? cs['top-level'] : ''}>{item.label}</span>
      </Badge>
    );
    if (item && item.link) {
      return (
        <Link className={cs['link']} to={item.link}>
          {content}
        </Link>
      );
    } else return content;
  };
  getPathKeys = () => {
    const {
      location: { pathname }
    } = this.props;
    const paths = pathname.split('/');
    return paths.reduce((keys, path) => {
      const newKeys = keys.map(key => [key, path].join('/'));
      return keys.concat(path, newKeys);
    }, []);
  };
  // 渲染常用报表目录
  renderUsualReport = subMenus => {
    const { navigation, usualReportList } = this.props;
    const reportNavList = _.get(
      navigation.find(nav => nav.id === 'reportmgmt'),
      'submenu',
      null
    );
    let dataList = [];
    Object.keys(usualReportList).filter(key => {
      if (usualReportList[key]) {
        this.findUsualNavigation(key, dataList, reportNavList);
      }
    });

    if (dataList && dataList.length) {
      subMenus.push(<Menu.Divider />);
      subMenus.push(
        <Menu.ItemGroup title={i18n['report.general.usual_report']}>
          {dataList.map(item => (
            <Menu.Item key={item.link || index}>
              {this.renderMenuItem(item, true)}
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      );
    }
    return subMenus;
  };
  findUsualNavigation = (key, dataList, reportNavList) => {
    const regk = `.*?\/${key}$`;
    const reg = new RegExp(regk, 'gi');
    reportNavList &&
      reportNavList.length &&
      reportNavList.forEach(item => {
        if (item.submenu) {
          item.submenu.forEach(sub => {
            if (sub.link && reg.test(sub.link)) {
              dataList.push(sub);
            }
          });
        } else {
          if (item.link && reg.test(item.link)) {
            dataList.push(item);
          }
        }
      });
  };
  _renderMenus = (item, index) => {
    const renderChildren = [];
    if (item.submenu) {
      const subMenus = item.submenu.map((subItem, i) => {
        if (subItem.submenu) {
          return (
            <Menu.SubMenu
              popupOffset={[1, 0]}
              key={subItem.link || subItem.id}
              title={this.renderMenuItem(subItem, false, true, true)}
            >
              {subItem.submenu.map((innerItem, i) => {
                return (
                  <Menu.Item key={innerItem.link || i}>
                    {this.renderMenuItem(innerItem, false, true)}
                  </Menu.Item>
                );
              })}
            </Menu.SubMenu>
          );
        } else {
          return (
            <Menu.Item key={subItem.link || i}>
              {this.renderMenuItem(subItem, false, true)}
            </Menu.Item>
          );
        }
      });
      // 添加常用报表
      if (item.id === 'reportmgmt') {
        this.renderUsualReport(subMenus);
      }
      if (item.externalMenu) {
        subMenus.push(<Menu.Divider />);
        subMenus.push(
          item.externalMenu.map((externalItem, i) => (
            <Menu.Item key={externalItem.link || i}>
              {this.renderMenuItem(externalItem)}
            </Menu.Item>
          ))
        );
      }
      const subMenuRoot = (
        <Menu.SubMenu
          popupOffset={[1, 0]}
          title={this.renderMenuItem(item, true)}
          key={item.link || index}
        >
          {subMenus}
        </Menu.SubMenu>
      );
      renderChildren.push(subMenuRoot);
    } else {
      renderChildren.push(
        <Menu.Item key={item.link || index}>
          {this.renderMenuItem(item, true)}
        </Menu.Item>
      );
    }

    return renderChildren;
  };

  render() {
    const {
      navigation,
      userInfo,
      introduceLink,
      brandInfo,
      userRights,
      location: { pathname }
    } = this.props;
    let { userTools, showLinkModal } = this.state;
    const newUserTools = this.getUserTools();
    const currentLanguage = languages.find(item => item.value === languageType);
    const settingMenu = GET_MENUS_FOR_HEADER({ userRights });
    const selectedKeys = this.getPathKeys();
    return (
      <Layout.Header
        className={`${cs['header']} ${cs[languageType.toLowerCase()]}`}
        id="page-header"
      >
        {/* logo */}
        <div className={cs['logo']}>
          <Image
            src={brandInfo.productLogo}
            alt={brandInfo.companyName}
            height="30"
          />
        </div>
        {/* 导航 */}
        <div className={`${cs['menu']}`}>
          <Menu mode="horizontal" selectedKeys={selectedKeys}>
            {navigation && navigation.map(this._renderMenus)}
          </Menu>
        </div>
        <div className={cs['tools']}>
          {/* 设置 */}
          {userRights['SYSTEM'] ? (
            <Dropdown
              trigger="hover"
              overlay={
                <Menu>
                  {settingMenu.map((item, i) => {
                    return (
                      <Menu.Item key={i}>
                        <Link to={item.link}>{item.label}</Link>
                      </Menu.Item>
                    );
                  })}
                </Menu>
              }
            >
              <span className={cs['header-tool-item']}>
                {/* 加一层span 直接写Icon无法触发dropdown 待解决 */}
                <Icon icon="set-soild" className={cs['tool-icon']} />
              </span>
            </Dropdown>
          ) : (
            undefined
          )}
          {/* 用户头像 */}
          <Dropdown
            trigger="hover"
            overlay={
              <Menu>
                {newUserTools.map((item, i) => {
                  return (
                    <Menu.Item key={item.id}>
                      {item.link ? (
                        <Link to={item.link}>{item.label}</Link>
                      ) : (
                        <a
                          href="javascript:void(0);"
                          onClick={this.userToolsSelect.bind(this, item)}
                        >
                          {item.label}
                        </a>
                      )}
                    </Menu.Item>
                  );
                })}
              </Menu>
            }
          >
            <span className={cs['header-tool-item']}>
              <Image
                src={userInfo.headImage}
                height="32"
                width="32"
                className={cs['head-image']}
              />
            </span>
          </Dropdown>
          <Popover placement="bottom" trigger="hover" content={userInfo.name}>
            <span className={cs['name']}>{userInfo.name}</span>
          </Popover>
          {/* 语言选择 */}
          <LanguageSelector
            value={currentLanguage}
            className={cs['language']}
            right
            onChange={this.languageSelect}
          />
        </div>
        <Dialog
          title={i18n['tipsmodal.title']}
          visible={this.state.switchLogoutModalVisible}
          closable={true}
          okType="danger"
          cancelText={i18n['general.cancel']}
          okText={i18n['general.apply']}
          onOk={this.toggleUiVersion.bind('uiSwitcher')}
          onCancel={this.toggleVisible}
        >
          {i18n['navigation.uiswitcher.confirm_info']}
        </Dialog>
      </Layout.Header>
    );
  }
}
export default withRouter(
  connect(
    ({ common: { usualReportList } }) => {
      return { usualReportList };
    },
    { initialUsualReportList }
  )(Header)
);
