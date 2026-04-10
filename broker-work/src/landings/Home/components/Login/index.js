import {
  setItem as setSessionStorageItem,
  removeItem as removeSessionStorageItem,
  getItem as getSessionStorageItem
} from 'utils/sessionStorageShare';
import { findDOMNode } from 'react-dom';
import Root from '../../containers/Root';
import cs from './Login.less';
// import Form from 'components/Form';
import { NavLink as Link } from 'react-router-dom';
// import Checkbox from 'components/Checkbox';
import { Checkbox, Button, Input, Form, Alert } from 'lean-ui';
import bowser from 'bowser';
import i18n from 'utils/i18n';
import { setTrimString } from 'utils/trim';
import { getLoginPosition } from 'utils/loginPosition';
import chromeIcon from './chrome.png';
import Cookies from 'js-cookie';
import Header from '../Header';
import {
  FRONT_LATEST_VERSION_STORAGE_KEY,
  CURRENT_USER_VERSION_TYPE_STORAGE_KEY,
  LATEST_OLD_RELEASE_VERSION_STORAGE_KEY,
  CONFIG_VERSION_TYPE_STORAGE_KEY,
  LATEST_OLD_RELEASE_VERSION,
  VERSION_RELEASE,
  VERSION_BETA
} from '../../constant';
import { getType as getLanguageType } from '../../../../utils/language';
const DEFAULT_LANGUAGE_KEY = 'DEFAULT_LANGUAGE_DATA';

// 用户在登陆页面切换语言后, 需要在登陆时把语言发送给后端
// 但切换语言后页面会刷新, 因此需要把切换后的语言缓存起来.
const LANGUAGE_TYPE_CACHE_KEY = 'LANGUAGE_TYPE_CACHE';
const REMEMBER_ME_KEY = 'REMEMBER_ME_KEY';

const loginBoxPosition = getLoginPosition();
export default class Login extends PureComponent {
  state = {
    lowerBrowser: false,
    browserDownloadUrl: '',
    disableSubmitBtn: false,
    dataReady: false,
    showAuth: false,
    showAuthTip: false,
    authCode: '',
    disableAuthSubmitBtn: false
  };

  componentDidMount() {
    const {
      getBrandInfo,
      getLanguage,
      getAccess,
      modifyParams,
      loginParams
    } = this.props;
    getBrandInfo().then(res => {
      const { data: { languages, defaultLanguage } = {}, result } = res;
      if (!result) return;
      // 仅使用已启用的语言
      const enabledLanguages = languages.filter(lang => lang.enabled);
      // 获取默认语言，如果没有默认语言，则选择第一个被启用的语言
      let _defaultLanguage = '';
      if (enabledLanguages.some(lang => defaultLanguage === lang.value)) {
        _defaultLanguage = defaultLanguage;
        window.localStorage.setItem('DEFAULT_LANGUAGE_DATA', '');
      } else {
        _defaultLanguage = _.get(enabledLanguages, '[0].value', 'en-US');
      }
      // const _defaultLanguage = _.get(defaultLanguage, '[0].value', 'en-US');
      // 优先使用用户设置的语言
      // 再者使用SC品牌设置的默认系统语言
      // 再者使用已启用语言的第一个
      // 再者将回退至英文[en-US]
      const langType = getLanguageType(_defaultLanguage);
      const localDefaultLanguage = window.localStorage.getItem(
        DEFAULT_LANGUAGE_KEY
      );
      // 如果是未启用或支持的浏览器语言，则使用默认语言
      if (
        !enabledLanguages.find(lang => langType === lang.value) &&
        !localDefaultLanguage
      ) {
        console.info(
          'LANGUAGE NOT SUPPORT!!!',
          `SWITCH TO [${_defaultLanguage}]`
        );
        this.props.setLanguageType(_defaultLanguage);
        return;
      }
      // 优化显示，让用户在首次进入时，等待加载完成显示，而不是看到页面的反复刷新。
      this.setState({ dataReady: true }, this.setInitStatus);
      getLanguage();
      getAccess();
    });
    // 加载网易云验证
    const head = document.getElementsByTagName('head')[0];
    const gt = document.createElement('script');
    gt.src = `//cstaticdun.126.net/load.min.js?t=${Date.now()}`;
    head.appendChild(gt);
    // 浏览器版本检测
    let lowerBrowser = false;
    let browserDownloadUrl =
      '//leanwork-static.oss-cn-hangzhou.aliyuncs.com/static/browser/chrome';
    const browserVersion = Number(bowser.version);
    // ie9 及以下, chrome 62 及以下. 提示下载最新版chrome
    if (
      (bowser.msie && browserVersion <= 9) ||
      (bowser.chrome && browserVersion <= 74)
    ) {
      lowerBrowser = true;
      if (bowser.mac) {
        browserDownloadUrl += '.dmg';
      } else if (bowser.linux) {
        browserDownloadUrl += '.deb';
      } else {
        browserDownloadUrl += '.exe';
      }
    }
    this.setState({ lowerBrowser, browserDownloadUrl });
  }

  setInitStatus = () => {
    const { modifyParams, loginParams } = this.props;
    const params = {};
    // 从缓存获取用户语言
    const cacheLanguageType = getSessionStorageItem(LANGUAGE_TYPE_CACHE_KEY);
    if (cacheLanguageType) {
      params['language'] = cacheLanguageType;
      removeSessionStorageItem(LANGUAGE_TYPE_CACHE_KEY);
    }
    // 从缓存获取用户id
    const account = window.localStorage.getItem(REMEMBER_ME_KEY);
    if (account) {
      const loginName = findDOMNode(this.refs['loginName']);
      loginName.value = account;
      // params['loginName'] = account;
      params['remember'] = true;
    }
    modifyParams({
      ...loginParams,
      ...params
    });
  };

  modifyParams = (field, e) => {
    const { loginParams, modifyParams } = this.props;
    let value = e.target ? e.target.value : e;
    if (field === 'remember') {
      value = e.target.checked;
      // 从缓存删除
      if (!value) window.localStorage.removeItem(REMEMBER_ME_KEY);
    }
    modifyParams({
      ...loginParams,
      [field]: value
    });
  };

  enterSubmit = e => {
    if (e.keyCode !== 13) return;
    this.submit();
  };

  submit = () => {
    const {
      loginParams: { remember, language, neCaptchaDTO },
      submit,
      getCurrentUserRight,
      showLoginError,
      logout,
      valideCode,
      getAccessConfig
    } = this.props;

    const pwd = document.getElementById('passWord');
    const userName = document.getElementById('userName');
    const password = pwd ? pwd.value : '';
    const loginName = setTrimString(userName ? userName.value : '');

    // 记住我功能, 在localStorage中记录账号
    if (remember) {
      window.localStorage.setItem(REMEMBER_ME_KEY, loginName);
    }

    this.setState({
      disableSubmitBtn: true
    });

    submit({ password, loginName, language, neCaptchaDTO }, valideCode).then(
      ({ data }) => {
        if (data.state === 'ok') {
          getAccessConfig().then(res => {
            if (res.result) {
              const needAuth = _.get(res.data, 'detail.secret', '');
              if (needAuth) {
                this.loginData = data;
                this.setState({
                  showAuth: true
                });
              } else {
                this.loginProcess(data);
              }
            }
          });
        } else {
          this.setState({
            disableSubmitBtn: false
          });
        }
      }
    );
  };

  loginProcess = data => {
    const {
      getCurrentUserRight,
      showLoginError,
      history: { push },
      updateLoginIpInfo,
      logout
    } = this.props;
    this.loginData = null;
    Promise.resolve({ data })
      .then(({ data }) => {
        if (data.state === 'ok') {
          updateLoginIpInfo({
            isSameLastLoginIp: data.isSameLastLoginIp,
            lastLoginIp: data.lastLoginIp
          });
          return getCurrentUserRight().then(res => {
            return Promise.resolve({
              res,
              frontVersion: data.frontVersion,
              oldFrontVersion: data.oldFrontVersion,
              uiVersion: data.uiVersion
            });
          });
        }
        this.setState({
          disableSubmitBtn: false
        });
        return Promise.resolve({
          res: { result: false }
        });
      })
      .then(({ res, oldFrontVersion, frontVersion, uiVersion }) => {
        this.setState({
          disableSubmitBtn: false
        });
        if (!res.result) return;
        const rights = res.data;
        let url;
        // 可用入口
        if (rights['DASHBOARD']) {
          url = '/dashboard';
        } else if (rights['BW_USER']) {
          url = '/usermgmt';
        } else if (rights['TAUSER_ENABLE']) {
          url = '/bwtauser';
        } else if (rights['CUSTOMER']) {
          url = '/custommgmt';
        } else if (rights['TASK']) {
          url = '/taskmgmt';
        } else if (rights['ACCOUNT']) {
          url = '/accountmgmt';
        } else if (rights['STAT_VIEW_ACC']) {
          url = '/reportmgmt#/reports';
        } else if (rights['STAT_VIEW_COMMISSION']) {
          url = '/reportmgmt#/commissionreports';
        }
        if (url) {
          const feVersion = document.head
            .querySelector('#feVersion')
            .getAttribute('feVersion');
          if (feVersion === 'development') {
            push(url);
            return;
          }
          // 判断是否需要切换到旧版本UI
          if (
            this.switchToOldUiVersion(
              uiVersion,
              oldFrontVersion,
              frontVersion,
              url
            )
          )
            return;
          if (frontVersion !== feVersion) {
            Cookies.set('feVersion', frontVersion, {
              expires: 3600
            });
            window.location.href = window.location.origin + url;
          } else {
            Cookies.set('feVersion', feVersion, {
              expires: 3600
            });
            push(url);
          }
        } else {
          logout().then(() => {
            showLoginError(i18n['login.no_available_entry']);
          });
        }
      });
  };

  // 验证v1是是否高于v2版本
  versionNewerThan(v1 = '', v2 = '') {
    let v1N = v1.replace(/^v/, '').split('.');
    let v2N = v2.replace(/^v/, '').split('.');
    let isNewer = false;
    for (let vi = 0; vi < v1N.length; vi++) {
      let _v1 = Number(v1N[vi]),
        _v2 = Number(v2N[vi]);
      if (_v1 !== _v2) {
        isNewer = _v1 > _v2;
        break;
      }
    }
    return isNewer;
  }
  // 验证ver是否基于某一个大版本
  versionBaseOn(ver, base) {
    return ver.match(base);
  }

  // 初始化切换判断，并设置数据
  switchToOldUiVersion = (uiVersion, oldFrontVersion, frontVersion, url) => {
    let currentUserUiVersion =
      window.localStorage[CURRENT_USER_VERSION_TYPE_STORAGE_KEY];
    let isSwichToOld = false;
    // 缓存当前迭代最新版本号
    window.localStorage[FRONT_LATEST_VERSION_STORAGE_KEY] = frontVersion;
    window.localStorage[CONFIG_VERSION_TYPE_STORAGE_KEY] = uiVersion;
    let oldVersion = (window.localStorage[
      LATEST_OLD_RELEASE_VERSION_STORAGE_KEY
    ] = oldFrontVersion || LATEST_OLD_RELEASE_VERSION);
    // 当SC设置当前用户可以使用新版UI时进行操作
    if (uiVersion == VERSION_BETA) {
      // 如果用户进行了UI切换设置
      if (!!currentUserUiVersion) {
        // 如果用户切换到了旧版UI，则回退到用户设置的旧版本
        if (this.versionBaseOn(currentUserUiVersion, 'v6.12')) {
          // 验证是否设置了基于旧版的UI，并更新旧版UI版本
          window.localStorage[
            CURRENT_USER_VERSION_TYPE_STORAGE_KEY
          ] = oldVersion;
          isSwichToOld = true;
        } else if (this.versionNewerThan(frontVersion, currentUserUiVersion)) {
          // 验证新版UI是否有更新
          window.localStorage[
            CURRENT_USER_VERSION_TYPE_STORAGE_KEY
          ] = frontVersion;
        } // else switchVersion = latestOldVersion;
      } else {
        isSwichToOld = true;
      }
    } else if (uiVersion == VERSION_RELEASE) {
      // 当SC设置当前用户只能使用旧版UI时，直接切换到旧版UI
      isSwichToOld = true;
    }
    if (isSwichToOld) {
      Cookies.set('feVersion', oldVersion, {
        expires: 3600
      });
      window.location.href = window.location.origin + url;
      return true;
    }
  };

  hideLowerBrowserWarning = () => {
    this.setState({
      lowerBrowser: false
    });
  };

  onLanguageChange = type => {
    setSessionStorageItem({ [LANGUAGE_TYPE_CACHE_KEY]: type });
    this.props.setLanguageType(type);
  };

  authCodeChange = e => {
    this.setState({
      authCode: e.target.value
    });
  };

  authSubmit = () => {
    const { authCode } = this.state;
    const { verifyAuthCode, showTopAlert } = this.props;
    this.setState({
      disableAuthSubmitBtn: true
    });
    verifyAuthCode({
      operation: 'LOGIN',
      verificationCode: authCode
    }).then(({ result, data }) => {
      this.setState({
        disableAuthSubmitBtn: false
      });
      if (result && data) {
        this.loginProcess(this.loginData);
      } else {
        showTopAlert({
          bsStyle: 'danger',
          content: i18n['login.double_auth.error']
        });
      }
    });
  };

  authTipClick = () => {
    const { showAuthTip } = this.state;
    this.setState({ showAuthTip: !showAuthTip });
  };

  authCancel = () => {
    this.setState({ showAuth: false, disableSubmitBtn: false });
    this.loginData = null;
  };

  render() {
    if (!this.state.dataReady) return null;
    let v;
    switch (loginBoxPosition) {
      case 'LEFT':
        v = this.renderLeft();
        break;
      case 'RIGHT':
        v = this.renderRight();
        break;
      default:
        v = this.renderCenter();
        break;
    }
    return v;
  }
  renderCenter = () => {
    const {
      loginParams: { remember },
      errorMessage,
      valideCode,
      brandInfo: { productLogo, companySite, defaultLanguage }
    } = this.props;
    const {
      lowerBrowser,
      browserDownloadUrl,
      disableSubmitBtn,
      showAuth,
      disableAuthSubmitBtn,
      showAuthTip,
      authCode
    } = this.state;
    let warning;
    if (lowerBrowser) {
      warning = (
        <Alert
          className={cs['browser-alert']}
          onClose={this.hideLowerBrowserWarning}
          message={
            <div>
              {i18n['login.browser_warning']}
              <a
                className={cs['broswer-download']}
                href={browserDownloadUrl}
                target="_blank"
              >
                <img src={chromeIcon} height="30" />
                Chrome
              </a>
            </div>
          }
          type="warning"
        />
      );
    }
    return (
      <Root warning={warning} className={cs['login']}>
        <Header
          onLanguageChange={this.onLanguageChange}
          errorMessage={errorMessage}
          companySite={companySite}
          defaultLanguage={defaultLanguage}
          title={
            showAuth ? (
              i18n['login.double_auth']
            ) : (
              <img className={cs['logo']} src={productLogo} alt="logo" />
            )
          }
        />
        {showAuth ? (
          <Form>
            <Form.Item col={1} className={cs['loginFormItem']}>
              <Form.Label className={cs['centerLable']}>
                {i18n['login.double_auth.code']}:
              </Form.Label>
              <Form.Control>
                <input
                  className="lean-input"
                  id="authCode"
                  type="text"
                  placeholder={i18n['login.double_auth.placeholder']}
                  onChange={this.authCodeChange}
                />
              </Form.Control>
            </Form.Item>
            <Form.Item col={1} className={cs['loginFormItem']}>
              <a href="javascript:;" onClick={this.authTipClick}>
                {i18n['login.double_auth.cant_get']}:
              </a>
              <div className={cs.auth_tip}>
                {showAuthTip ? i18n['login.double_auth.cant_get_tip'] : ''}
              </div>
            </Form.Item>
            <Form.Item
              className={`${cs['left-login-btn']} ${cs['loginFormItem']}`}
              col={1}
            >
              <Button
                id="submit"
                onClick={this.authSubmit}
                className={cs['submit-btn']}
                type="primary"
                size="lg"
                disabled={!authCode || disableAuthSubmitBtn}
              >
                {i18n['login.double_auth.login']}
              </Button>
              <Button
                onClick={this.authCancel}
                className={cs['submit-btn']}
                size="lg"
              >
                {i18n['general.cancel']}
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form>
            <Form.Item col={1} className={cs['loginFormItem']}>
              <Form.Label className={cs['centerLable']}>
                {i18n['login.user']}
              </Form.Label>
              <Form.Control>
                <Input ref="loginName" id="userName" type="text" />
              </Form.Control>
            </Form.Item>
            <Form.Item col={1} className={cs['loginFormItem']}>
              <Form.Label className={cs['centerLable']}>
                {i18n['login.password']}
              </Form.Label>
              <Form.Control>
                <Input
                  ref="password"
                  id="passWord"
                  onKeyUp={this.enterSubmit}
                  type="password"
                />
              </Form.Control>
            </Form.Item>
            {valideCode ? (
              <Form.Item col={1} className={cs['loginFormItem']}>
                <div id="gt" style={{ width: '100%' }} />
              </Form.Item>
            ) : (
              undefined
            )}
            <Form.Item
              className={`${cs['remember-box']} ${cs['loginFormItem']}`}
              col={1}
            >
              <div className={cs['remember']}>
                <Checkbox
                  inline
                  checked={remember}
                  onChange={this.modifyParams.bind(this, 'remember')}
                >
                  {i18n['login.remember_me']}
                </Checkbox>
              </div>
              <Link className={cs['forget-passowrd']} to="/forgotPassword">
                {i18n['login.forget_pwd']}
              </Link>
            </Form.Item>
            <Form.Item
              className={`${cs['left-login-btn']} ${cs['loginFormItem']}`}
              col={1}
            >
              <Button
                id="submit"
                onClick={this.submit}
                className={cs['submit-btn']}
                type="primary"
                size="lg"
                disabled={disableSubmitBtn}
              >
                {i18n['login.login']}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Root>
    );
  };
  renderLeft = () => {
    const {
      loginParams: { remember },
      errorMessage,
      valideCode,
      brandInfo: { productLogo, companySite }
    } = this.props;
    const {
      lowerBrowser,
      browserDownloadUrl,
      disableSubmitBtn,
      showAuth,
      disableAuthSubmitBtn,
      showAuthTip,
      authCode
    } = this.state;
    let warning;
    if (lowerBrowser) {
      warning = (
        <Alert
          onDismiss={this.hideLowerBrowserWarning}
          type="warning"
          message={
            <div style={{ width: '65px' }}>
              {i18n['login.browser_warning']}
              <a
                className={cs['broswer-download']}
                href={browserDownloadUrl}
                target="_blank"
              >
                <img src={chromeIcon} height="30" />
                Chrome
              </a>
            </div>
          }
        />
      );
    }
    return (
      <Root warning={warning} align="left" className={cs['login']}>
        <Header
          onLanguageChange={this.onLanguageChange}
          companySite={companySite}
          errorMessage={errorMessage}
          title={
            showAuth ? (
              i18n['login.double_auth']
            ) : (
              <img className={cs['logo']} src={productLogo} alt="logo" />
            )
          }
        />
        {showAuth ? (
          <Form>
            <Form.Item col={1} className={cs['loginFormItem']}>
              <Form.Label className={cs['centerLable']}>
                {i18n['login.double_auth.code']}:
              </Form.Label>
              <Form.Control>
                <input
                  className="lean-input"
                  id="authCode"
                  type="text"
                  placeholder={i18n['login.double_auth.placeholder']}
                  onChange={this.authCodeChange}
                />
              </Form.Control>
            </Form.Item>
            <Form.Item col={1} className={cs['loginFormItem']}>
              <a href="javascript:;" onClick={this.authTipClick}>
                {i18n['login.double_auth.cant_get']}:
              </a>
              <div className={cs.auth_tip}>
                {showAuthTip ? i18n['login.double_auth.cant_get_tip'] : ''}
              </div>
            </Form.Item>
            <Form.Item
              className={`${cs['left-login-btn']} ${cs['loginFormItem']}`}
              col={1}
            >
              <Button
                id="submit"
                onClick={this.authSubmit}
                className={cs['submit-btn']}
                type="primary"
                size="lg"
                disabled={!authCode || disableAuthSubmitBtn}
              >
                {i18n['login.double_auth.login']}
              </Button>
              <Button
                onClick={this.authCancel}
                className={cs['submit-btn']}
                size="lg"
              >
                {i18n['general.cancel']}
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form>
            <Form.Item
              col={1}
              className={`${cs['loginFormItem']} ${cs['title']}`}
            >
              {i18n['login.title']}
            </Form.Item>
            <Form.Item col={1} className={cs['loginFormItem']}>
              <Form.Label>{i18n['login.user']}</Form.Label>
              <Form.Control>
                <Input ref="loginName" id="userName" line type="text" />
              </Form.Control>
            </Form.Item>
            <Form.Item col={1} className={cs['loginFormItem']}>
              <Form.Label>{i18n['login.password']}</Form.Label>
              <Form.Control>
                <Input
                  ref="password"
                  id="passWord"
                  line
                  onKeyUp={this.enterSubmit}
                  type="password"
                />
              </Form.Control>
            </Form.Item>
            {valideCode ? (
              <Form.Item col={1} className={cs['loginFormItem']}>
                <div id="gt" style={{ width: '100%' }} />
              </Form.Item>
            ) : (
              undefined
            )}
            <Form.Item
              className={`${cs['left-login-btn']} ${cs['loginFormItem']}`}
              col={1}
            >
              <Button
                id="submit"
                onClick={this.submit}
                className={cs['submit-btn']}
                type="primary"
                size="lg"
                disabled={disableSubmitBtn}
              >
                {i18n['login.login']}
              </Button>
            </Form.Item>
            <Form.Item className={`${cs['loginFormItem']}`} col={1}>
              <div className={cs['remember-box']}>
                <div className={cs['remember']}>
                  <Checkbox
                    inline
                    checked={remember}
                    onChange={this.modifyParams.bind(this, 'remember')}
                  >
                    {i18n['login.remember_me']}
                  </Checkbox>
                </div>
                <Link className={cs['forget-passowrd']} to="/forgotPassword">
                  {i18n['login.forget_pwd']}
                </Link>
              </div>
            </Form.Item>
          </Form>
        )}
      </Root>
    );
  };
  renderRight = () => {
    const {
      loginParams: { remember },
      errorMessage,
      valideCode,
      brandInfo: { productLogo, companySite }
    } = this.props;
    const {
      lowerBrowser,
      browserDownloadUrl,
      disableSubmitBtn,
      showAuth,
      disableAuthSubmitBtn,
      showAuthTip,
      authCode
    } = this.state;
    let warning;
    if (lowerBrowser) {
      warning = (
        <Alert
          onDismiss={this.hideLowerBrowserWarning}
          type="warning"
          message={
            <div style={{ width: '65px' }}>
              {i18n['login.browser_warning']}
              <a
                className={cs['broswer-download']}
                href={browserDownloadUrl}
                target="_blank"
              >
                <img src={chromeIcon} height="30" />
                Chrome
              </a>
            </div>
          }
        />
      );
    }
    return (
      <Root warning={warning} align="right" className={cs['login']}>
        <Header
          onLanguageChange={this.onLanguageChange}
          errorMessage={errorMessage}
          companySite={companySite}
          fixed
          title={<img className={cs['logo']} src={productLogo} alt="logo" />}
        />
        {showAuth ? (
          <Form>
            <Form.Item col={1} className={cs['rightLoginFormItem']}>
              <Form.Label className={cs['centerLable']}>
                {i18n['login.double_auth.code']}:
              </Form.Label>
              <Form.Control>
                <input
                  className="lean-input"
                  id="authCode"
                  type="text"
                  placeholder={i18n['login.double_auth.placeholder']}
                  onChange={this.authCodeChange}
                />
              </Form.Control>
            </Form.Item>
            <Form.Item col={1} className={cs['rightLoginFormItem']}>
              <a href="javascript:;" onClick={this.authTipClick}>
                {i18n['login.double_auth.cant_get']}:
              </a>
              <div className={cs.auth_tip}>
                {showAuthTip ? i18n['login.double_auth.cant_get_tip'] : ''}
              </div>
            </Form.Item>
            <Form.Item
              className={`${cs['left-login-btn']} ${cs['rightLoginFormItem']}`}
              col={1}
            >
              <Button
                id="submit"
                onClick={this.authSubmit}
                className={cs['submit-btn']}
                type="primary"
                size="lg"
                disabled={!authCode || disableAuthSubmitBtn}
              >
                {i18n['login.double_auth.login']}
              </Button>
              <Button
                onClick={this.authCancel}
                className={cs['submit-btn']}
                size="lg"
              >
                {i18n['general.cancel']}
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form>
            <Form.Item
              col={1}
              className={`${cs['rightLoginFormItem']} ${cs['rightTitle']}`}
            >
              {i18n['login.title']}
            </Form.Item>
            <Form.Item col={1} className={cs['rightLoginFormItem']}>
              <Form.Control>
                <Input
                  ref="loginName"
                  id="userName"
                  size="large"
                  placeholder={i18n['login.user']}
                  className={`form-control`}
                  type="text"
                />
              </Form.Control>
            </Form.Item>
            <Form.Item col={1} className={cs['rightLoginFormItem']}>
              <Form.Control>
                <Input
                  ref="password"
                  id="passWord"
                  size="large"
                  placeholder={i18n['login.password']}
                  onKeyUp={this.enterSubmit}
                  className={`form-control`}
                  type="password"
                />
              </Form.Control>
            </Form.Item>
            {valideCode ? (
              <Form.Item col={1} className={cs['rightLoginFormItem']}>
                <div id="gt" style={{ width: '100%' }} />
              </Form.Item>
            ) : (
              undefined
            )}
            <Form.Item
              className={`${cs['remember-box']} ${cs['rightLoginFormItem']}`}
              col={1}
            >
              <div className={cs['remember']}>
                <Checkbox
                  inline
                  checked={remember}
                  onChange={this.modifyParams.bind(this, 'remember')}
                >
                  {i18n['login.remember_me']}
                </Checkbox>
              </div>
              <Link className={cs['forget-passowrd']} to="/forgotPassword">
                {i18n['login.forget_pwd']}
              </Link>
            </Form.Item>
            <Form.Item
              className={`${cs['login-btn-box']} ${cs['rightLoginFormItem']}`}
              col={1}
            >
              <Button
                id="submit"
                onClick={this.submit}
                className={cs['submit-btn']}
                type="primary"
                size="lg"
                disabled={disableSubmitBtn}
              >
                {i18n['login.login']}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Root>
    );
  };
}
