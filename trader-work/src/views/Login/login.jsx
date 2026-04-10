import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Spin } from "antd";
import Loading from "@/components/Loading";
import message from "@/components/Message";

import i18n from "@/utils/i18n";
import utils from "@/utils/common";
import * as actions from "@/actions/Login/login";
import * as loginActions from "@/actions/Login/loginInput";
import * as commonActions from "@/actions/Common/common";
import reducers from "@/reducers/Login/login";

import { injectReducer } from "@/utils/injectReducer";
injectReducer("login", reducers);

import LoginRegister from "./loginRegister";
import LanguageSelector from "@/components/LanguageSelector";
import {
  getType as getLanguageType,
  setType as setLanguageType
} from "@/utils/language";
import { languages } from "@/utils/config";
import wx from "@/images/wx.png";
import logo from "@/images/logo.png";
import chrome from "@/images/chrome.png";

import "./login.less";
import bowser from "bowser";
import { DEFAULT_LANGUAGE_TYPE, ls, TOKEN, USER_INFO } from "@/utils/storage";

class Login extends React.Component {
  state = {
    language: languages[0],
    dataReady: false,
    browserVersionTips: false,
    browserDownloadUrl: ""
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // 判断浏览器版本
    let browserDownloadUrl =
      "//leanwork-static.oss-cn-hangzhou.aliyuncs.com/static/browser/chrome";
    const browserVersion = Number(bowser.version);
    // ie9 以下, chrome 62 及以下. 提示下载最新版chrome;
    const browserBox = ["firefox", "msie", "chrome"];
    if (
      (bowser.msie && browserVersion <= 9) ||
      (bowser.chrome && browserVersion <= 74) ||
      (bowser.firefox && browserVersion <= 65) ||
      !browserBox.some(item => bowser[item])
    ) {
      if (bowser.mac) {
        browserDownloadUrl += ".dmg";
      } else if (bowser.linux) {
        browserDownloadUrl += ".deb";
      } else {
        browserDownloadUrl += ".exe";
      }
      this.setState({
        browserVersionTips: true,
        browserDownloadUrl
      });
    }
    this.props.fetchBrandInfo().then(res => {
      const { data: { languages, defaultLanguage } = {}, result } = res;
      if (!result) return;
      // 仅使用已启用的语言
      const enabledLanguages = languages.filter(lang => lang.enabled);
      // 获取默认语言，如果没有默认语言，则选择第一个被启用的语言
      let _defaultLanguage = "";
      if (enabledLanguages.some(lang => defaultLanguage === lang.value)) {
        _defaultLanguage = defaultLanguage;
        ls.setItem(DEFAULT_LANGUAGE_TYPE, "");
      } else {
        _defaultLanguage = _.get(enabledLanguages, "[0].value", "en-US");
      }
      // 优先使用用户设置的语言
      // 再者使用SC品牌设置的默认系统语言
      // 再者使用已启用语言的第一个
      // 再者将回退至英文[en-US]
      const langType = getLanguageType(_defaultLanguage);
      const localDefaultLanguage = ls.getItem(DEFAULT_LANGUAGE_TYPE);
      // 如果是未启用或支持的浏览器语言，则使用默认语言
      if (
        !enabledLanguages.find(lang => langType === lang.value) &&
        !localDefaultLanguage
      ) {
        console.info(
          "LANGUAGE NOT SUPPORT!!!",
          `SWITCH TO [${_defaultLanguage}]`
        );
        this.props.setLanguageType(_defaultLanguage);
        return;
      }
      // let language = enabledLanguages.find(item => langType === item.value);
      // this.setState({ language });
      this.setState({ dataReady: true });
      this.props.getPubkey();
      this.props.fetchPlatforms();
      this.props.getModules();
      this.props.getCountryPhone();
      this.props.loginConfigAccess().then(rs => {
        if (rs.result && rs.data.proxyRegisterable) {
          this.props.fetchBWBrandInfo();
        }
      });
      this.props.getLanguage();
    });

    let params = utils.parseUrlParams();
    //接收token登录
    const user = params.user
    if(user){
      const userInfo = JSON.parse(user)
      ls.setItem(TOKEN, userInfo.token)
      ls.setItem(USER_INFO, userInfo)
      this.props.history.push({name: '/personal/overview',query: {}})
    }
    if (!params.res) return false;
    switch (params.res) {
      // 邀请注册页面链接失效
      case "1":
        message["error"](i18n["signup.registerinvite.link,invalid"]);
        break;
      // 邮件注册激活成功
      case "2":
        message["success"](i18n["signup.type.email.activeemailsuccess"]);
        break;
      // 邮件注册激活失败
      case "3":
        message["error"](i18n["signup.type.email.activeemailfailed"]);
        break;
      // 邮件注册激活页面链接失效
      case "4":
        message["error"](i18n["signup.type.email.activelinkinvalid"]);
        break;
      // 修改绑定邮箱成功
      case "5":
        message["success"](i18n["userinfo.base.email.bind.success"]);
        break;
      case "6":
        // 修改绑定邮箱失败
        message["error"](i18n["userinfo.base.email.bind.failed"]);
        break;
    }
  }
  closeVersionTips = () => {
    this.setState({
      browserVersionTips: false
    });
  };
  render() {
    const { brandInfo, history } = this.props;
    const { browserVersionTips, browserDownloadUrl } = this.state;
    let fromApp = window.localStorage.getItem("fromApp");
    let href = "#";
    if (brandInfo.companySite && brandInfo.companySite != "http://") {
      href = brandInfo.companySite;
    }
    let style = {};
    if (brandInfo.background) {
      style = {
        backgroundImage: `url(${brandInfo.background})`
      };
    }
    // 在未获取到正确语言前不展示界面
    if (!this.state.dataReady) return null;
    //  设置title、品牌logo
    const {
      location: { pathname }
    } = history;
    const minHeight = {
      minHeight: 0
    };
    const isWX = navigator.userAgent.indexOf('MicroMessenger')!==-1
    return (
      <div className="login-page" style={style}>
        {isWX && <div className="wx-bg">
          <img src={wx}></img>
        </div>}
        {this.props.loading ? <Loading /> : null}
        <div className="login-wrap">
          {browserVersionTips && (
            <div className="browser-version-tips">
              <span
                className="browser-version-tips-close icon-close01"
                onClick={this.closeVersionTips}
              />
              <div>
                <p>
                  {i18n["general.browser_version.tips"]}
                  <img className="chrome-icon" src={chrome} />
                  <a href={browserDownloadUrl}>chrome</a>
                </p>
              </div>
            </div>
          )}
          <div
            className="login-position"
            style={pathname === "/forgetPwd" ? minHeight : {}}
          >
            <div className="login-header">
              <div className="login-logo left">
                <a href={href}>
                  <img src={brandInfo.productLogo} />
                </a>
              </div>
              {!fromApp && (
                <div className="right">
                  <LanguageSelector
                    language={brandInfo.languages}
                    defaultLanguage={brandInfo.defaultLanguage}
                    onChange={this.props.setLanguageType}
                  />
                </div>
              )}
            </div>
            {this.props.children}
          </div>
        </div>
        <div className="login-test">
          <div dangerouslySetInnerHTML={{ __html: brandInfo.loginTip }} />
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    ({ common, login }) => {
      return {
        loading: common.loading,
        brandInfo: common.brandInfo
      };
    },
    {
      ...actions,
      ...commonActions,
      ...loginActions
    }
  )(Login)
);
