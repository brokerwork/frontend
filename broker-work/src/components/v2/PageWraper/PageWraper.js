import cs from './index.less';
import PageHeader from 'components/Header';
import { LayoutContainer } from './Layout';
import Loading from 'components/Loading';
import { OpacityWrapper } from 'components/OpacityWrapper';
import TipsModal from 'components/TipsModal';
import TopAlert from 'components/TopAlert';
import i18n from 'utils/i18n';
import { get, getLastResponseTime } from 'utils/ajax';
import { getType as getLanguageType } from 'utils/language';
import ModalMessage from 'components/ModalMessage';
import IpInfoModal from 'components/IpInfoModal';
import ExtraServiceAlert from 'components/ExtraServiceAlert';
import { MENUS } from 'utils/headerMenus';
import setPageTitle from 'utils/setPageTitle';
import { gotoLoginPage } from 'utils/sessionStorageShare';
import resetScroll from 'components/v2/resetScroll';
import { Alert } from 'lean-ui';
import {
  showTipsModal,
  showTopAlert,
  getAccessConfig,
  getExtraService
} from 'commonActions/actions';
import _ from 'lodash';
resetScroll();
let timer = undefined;
let isTimeout = false;
const TIMEOUT_CODE = 'PUB_AUTH_0000018';
let taskTodoTimer = null;
const DELAY = 5 * 60 * 1000;
const loginStatusGuardTime = 1000 * 10;

const loginTimeout = dispatch => {
  setTimeout(() => {
    gotoLoginPage(dispatch);
  }, 2000);
};

const showInitPasswordModal = (dispatch, push) => {
  dispatch(
    showTipsModal({
      content: i18n['usermgmt.initPassword.tips'],
      onConfirm: cb => {
        push('/usersetting/securitySetting');
        cb();
      },
      noCancel: true
    })
  );
};

const autoGotoLoginPage = dispatch => {
  dispatch(
    showTopAlert({
      content: i18n['login_timeout.auto_Redirect.tips']
    })
  );

  setTimeout(() => {
    gotoLoginPage(dispatch);
  }, 2000);
};

const loginStatusGuard = dispatch => {
  const lastResTime = getLastResponseTime();
  const now = Date.now();
  if (!lastResTime) {
    loginStatusGuardTimer(dispatch);
    return;
  }
  if (now - lastResTime > 1000 * 51) {
    get({
      url: '/v1/user/token'
    }).then(({ result, data, mcode }) => {
      if (result === false) {
        if (mcode === TIMEOUT_CODE) {
          loginTimeout(dispatch);
        } else {
          autoGotoLoginPage(dispatch);
        }
        if (taskTodoTimer) clearInterval(taskTodoTimer);
        isTimeout = true;
      }
    });
  }
  if (!isTimeout) loginStatusGuardTimer(dispatch);
};

const loginStatusGuardTimer = dispatch => {
  timer = setTimeout(
    loginStatusGuard.bind(this, dispatch),
    loginStatusGuardTime
  );
};

const shouldUpdateScroll = (prevRouterProps, props) => {
  return true;
};

export default class PageWraper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 用户权限是否已经准备成功
      userRightReady: false
    };
  }

  componentWillUnmount() {
    const pageContainer = document.querySelector('#page-container');
    if (pageContainer) {
      pageContainer.removeEventListener(
        'scroll',
        this.modifyScrollLeftOffset,
        false
      );
    }
  }

  componentDidMount() {
    this.modifyScrollLeftOffset();
    const pageContainer = document.querySelector('#page-container');
    if (pageContainer) {
      pageContainer.addEventListener(
        'scroll',
        this.modifyScrollLeftOffset,
        false
      );
    }
    const {
      getBrandInfo,
      getUserInfo,
      getUnreadMessage,
      getCountry,
      getBanks,
      getUnreadModalMessage,
      dispatch,
      getCurrentUserRight,
      getLanguage,
      setLanguageType,
      location,
      getSystemSettings,
      getPersonalRule,
      getGioData,
      getObjects,
      getCustomReportList,
      getPhoneCountryCode,
      getAccountType,
      getCustomMenu,
      handleCustomMenu,
      getAccessConfig
    } = this.props;
    // 缓存银行
    getBanks();
    // 首先检查语言包的版本, 再做其他数据的请求
    getLanguage().then(() => {
      const userInfoPromise = getUserInfo();
      getUnreadMessage();
      getSystemSettings();
      getPersonalRule();
      getObjects();
      getUnreadModalMessage();
      getCustomReportList();
      getPhoneCountryCode();
      getAccessConfig();
      getExtraService();
      const userRightPromise = getCurrentUserRight();
      const brandInfoPromise = getBrandInfo().then(res => {
        if (!res.result) return Promise.resolve(res);
        const {
          data: { tenantId, siteName, productIcon }
        } = res;
        getAccountType(tenantId);
        // 设置title
        let currentModule = MENUS.filter(item => {
          const strings = location.pathname.split('/');

          return (
            item.id === strings[1] ||
            (item.submenu &&
              item.submenu.some(subItem => subItem.link === location.pathname))
          );
        })[0];

        if (!currentModule) {
          const strings = location.pathname.split('/');

          if (strings[1] === 'settings') {
            currentModule = {
              label: i18n['page.title.settings']
            };
          } else if (strings[1] === 'msgmgmt') {
            currentModule = {
              label: i18n['page.title.message.management']
            };
          }
        }

        setPageTitle(
          currentModule ? `${siteName} - ${currentModule.label}` : siteName
        );

        // 设置网站的favicon
        const iconEle = document.createElement('link');
        const iconEleIe = document.createElement('link');
        const head = document.getElementsByTagName('head')[0];
        iconEle.setAttribute('rel', 'shortcut icon');
        iconEle.setAttribute('type', 'image/x-icon');
        iconEle.setAttribute('href', productIcon);
        iconEleIe.setAttribute('rel', 'icon');
        iconEleIe.setAttribute('type', 'image/x-icon');
        iconEleIe.setAttribute('href', productIcon);
        head.appendChild(iconEleIe);
        head.appendChild(iconEle);
        getCountry(tenantId === 'T001256');
        return Promise.resolve(res);
      });
      // 检查超时登录
      loginStatusGuardTimer(dispatch);

      Promise.resolve(userInfoPromise).then(res => {
        const {
          history: { push },
          location
        } = this.props;
        if (!res.result) return Promise.resolve(res);
        const { needInitPass, lang, roleId } = res.data;
        // 检查是否需要修改密码
        if (needInitPass && location['pathname'] !== '/securityReset') {
          setTimeout(() => {
            push('/securityReset');
          }, 300);
        }
        // 检查用户定义的语言类型 是否与本地的语言类型一致
        // 不一致时, 需要设置语言类型为用户定义的语言类型
        if (!!lang && lang !== getLanguageType()) {
          setLanguageType(lang);
        }
        // sc自定义菜单
        getCustomMenu().then(res => {
          if (res.result) {
            // 处理
            const resetMenu = this.configCustomMenu(res.data, lang, roleId);
            handleCustomMenu(resetMenu);
          }
        });
      });
      // 用户权限请求成功后再render页面内容
      userRightPromise.then(res => {
        // 有任务栏目的权限时才请求待办任务数
        if (res.data && res.data['TASK']) {
          getObjects();
          clearInterval(taskTodoTimer);
          taskTodoTimer = setInterval(() => {
            getObjects();
          }, DELAY);
        }
        this.setState({
          userRightReady: true
        });
      });
      //得到用户信息及租户信息后,添加统计插件
      getGioData().then(res => {
        const { result, data } = res;
        if (!result) return;
        const {
          env,
          tenantId,
          tenantName,
          tenantType,
          userId,
          productType,
          roleName,
          roleTypeName,
          roleTypeId,
          userNum4RoleType
        } = data;
        if (
          !['normal', 'channel'].includes(tenantType) || // 租户类型非 [正常, 渠道] 的不统计
          !tenantId || // 没有租户Id 的不统计
          (env !== 'prod' && env !== 'test') || // qa环境的不统计
          productType !== 'NORMAL' // 开通产品类型不是 '正式' 的不统计
        )
          return;
        const gioKey = env === 'prod' ? '969d48a890b3cfd0' : '8ce9b212bddfd4d4';
        gio('init', gioKey, {});
        gio('clearUserId');
        gio('setUserId', `${tenantId}_${userId}`);
        gio('app.set', {
          company_id: tenantId,
          user_name: name,
          company_name: tenantName
        });
        gio('people.set', {
          roleName: roleName,
          loginUserName: name,
          tenantType: tenantType,
          companyId: tenantId,
          companyName: tenantName,
          roleTypeName: roleTypeName,
          [roleTypeId]: userNum4RoleType
        });
        gio('send');
      });
    });
  }

  modifyScrollLeftOffset = () => {
    // const left = window.pageXOffset;
    const pageContainer = document.querySelector('#page-container');
    let left = 0;
    if (pageContainer) left = pageContainer.scrollLeft;
    let pageXOffsetStyleElement = document.getElementById('pageXOffsetStyle');
    if (!pageXOffsetStyleElement) {
      pageXOffsetStyleElement = document.createElement('style');
      pageXOffsetStyleElement.setAttribute('id', 'pageXOffsetStyle');
      document.querySelector('head').appendChild(pageXOffsetStyleElement);
    }
    pageXOffsetStyleElement.innerHTML = `.pageXOffsetStyle {transform: translateX(-${left}px);}`;
  };
  // 处理自定义菜单
  configCustomMenu = (data, lang, roleId) => {
    // 筛选出启用菜单
    let copyData = _.cloneDeep(data).filter(item => item.enabled);
    // 如果order存在
    if (copyData.some(el => el.order)) {
      copyData = _.sortBy(copyData, ['order']);
    }
    const resetMenu = {};
    const resetMenuList = [];
    for (let item of copyData) {
      const copyItem = _.cloneDeep(item);
      // 判断权限 sc设置的 该角色是否有查看权限
      if (item.roleRight && item.roleRight.length) {
        if (!item.roleRight.includes(roleId)) {
          continue;
        }
      }
      copyItem.label = copyItem.message[lang] || copyItem.message['zh-CN'];
      copyItem.menuId = item.id;
      copyItem.link = `/customMenu/${item.id}`;
      if (item.parent === '0') {
        // 菜单用id指代哪个菜单模块，因获取的自定义菜单已存在id 因此需要特殊处理下，将id换成菜单指代模块的id，接口返回的id改成menuId
        // copyItem.id = 'custommenu';
        resetMenu[item.id] = copyItem;
        resetMenu[item.id].submenu = [];
      } else {
        delete copyItem.id;
        const menuKeys = Object.keys(resetMenu);
        if (menuKeys.includes(item.parent)) {
          resetMenu[item.parent].submenu.push(copyItem);
        }
      }
    }
    // 转换成数组
    for (let key in resetMenu) {
      // 如果菜单下面没有子菜单则删除 submenu 防止在hover到一级菜单时出现空白框
      if (!_.get(resetMenu[key], 'submenu', []).length) {
        delete resetMenu[key].submenu;
      } else {
        delete resetMenu[key].link;
      }
      resetMenuList.push(resetMenu[key]);
    }
    return resetMenuList;
  };
  render() {
    const {
      children,
      header,
      unreadModalMessage,
      userInfo,
      unreadMessage,
      myIntroduceLink,
      brandInfo,
      tipsModalData,
      closeTipsModal,
      topAlertData,
      closeTopAlert,
      loading,
      navigation,
      markMessageAsRead,
      transparentMask,
      markModalMessageAsRead,
      userRights,
      setLanguageType,
      getIntroduceLink,
      logout,
      bannerNoticeData,
      closeBannerNotice,
      closeRealeseNotice,
      realeseNoticeData,
      getTopRight,
      topRights,
      personalRules,
      personalReportShow,
      loginIpInfo,
      customNavigation,
      accessConfig,
      extraServiceData
    } = this.props;
    const { userRightReady } = this.state;
    // 导航有原有的导航加上自定义导航
    const navigationList = [...navigation, ...customNavigation];
    return (
      <div className={cs['pager-wrapper']}>
        <LayoutContainer className={cs['page-layout']}>
          {realeseNoticeData ? (
            <Alert
              onClose={closeRealeseNotice}
              className={cs['alert']}
              message={realeseNoticeData}
              type={'warning'}
              showIcon={false}
            />
          ) : (
            undefined
          )}
          <PageHeader
            navigation={navigationList}
            logout={logout}
            unreadMessage={unreadMessage}
            userInfo={userInfo}
            introduceLink={myIntroduceLink}
            brandInfo={brandInfo}
            userRights={userRights}
            markMessageAsRead={markMessageAsRead}
            setLanguageType={setLanguageType}
            getIntroduceLink={getIntroduceLink}
            personalRules={personalRules}
            personalReportShow={personalReportShow}
            {...header}
          />
          <OpacityWrapper appear>
            {bannerNoticeData ? (
              <Alert
                onClose={closeBannerNotice}
                showIcon={false}
                type={'success'}
                className={cs['alert']}
                message={bannerNoticeData.content}
              />
            ) : (
              undefined
            )}
          </OpacityWrapper>
          {userRightReady ? children : undefined}

          {tipsModalData ? (
            <TipsModal onHide={closeTipsModal} {...tipsModalData} />
          ) : (
            undefined
          )}

          {topAlertData ? (
            <TopAlert onClose={closeTopAlert} {...topAlertData} />
          ) : (
            undefined
          )}

          {transparentMask ? (
            <div className={cs['transparent-mask']} />
          ) : (
            undefined
          )}
          <OpacityWrapper appear>
            {loading ? <Loading show={loading} /> : undefined}
          </OpacityWrapper>
          {unreadModalMessage.length > 0 ? (
            <ModalMessage
              data={unreadModalMessage}
              markModalMessageAsRead={markModalMessageAsRead}
            />
          ) : (
            undefined
          )}
          {/* 根据sc后台设置 是否显示 */}
          {accessConfig.ipExceptionPrompt &&
          loginIpInfo.isSameLastLoginIp === false &&
          !loginIpInfo.closed ? (
            <IpInfoModal />
          ) : null}
          {extraServiceData.alert === 'true' ? (
            <ExtraServiceAlert extraServiceData={extraServiceData} />
          ) : null}
        </LayoutContainer>
      </div>
    );
  }
}
