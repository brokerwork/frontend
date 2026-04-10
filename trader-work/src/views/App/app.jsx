import { Component } from "react";
import { connect } from "react-redux";
import i18n from "@/utils/i18n";
import utils from "@/utils/common";
import Sidebar from "./sidebar";
import Loading from "@/components/Loading";
import { Select, Button, Badge } from "antd";
import Message from "@/components/Message";
const Option = Select.Option;
import * as commonActions from "@/actions/Common/common";
import * as actions from "@/actions/App/app";
import reducers from "@/reducers/App/app";
import { injectReducer } from "@/utils/injectReducer";
import StopServerNotice from "@/components/StopServerNotice";
injectReducer("app", reducers);
import { ls } from "@/utils/storage";

import "./common.less";
import "./app.less";
class App extends Component {
  constructor(props) {
    super(props);
    // 获取自定义菜单
    // this.props.getCustomMenu();
    // this.props.getTraderMenu("web");
    this.props.fetchBrandInfo().then(res => {
      //得到租户信息（用户信息已缓存）后,添加统计插件
      if (
        res.result &&
        (res.data.tenantType == "normal" || res.data.tenantType == "channel")
      ) {
        const userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
        const { tenantId, tenantName, tenantType, env } = res.data;
        if (userInfo && tenantId && env !== "qa") {
          const { userId, username } = userInfo;
          const gioKey =
            env === "prod" ? "87f1af6b20fc7638" : "ac6683a4c56178fb";
          gio("init", gioKey, {});
          //custom page code begin here
          gio("clearUserId");
          gio("setUserId", `${tenantId}_${userId}`);
          gio("app.set", {
            company_id: tenantId,
            user_name: username,
            company_name: tenantName
          });
          gio("people.set", {
            loginUserName: username,
            companyName: tenantName,
            companyId: tenantId,
            tenantType: tenantType
          });
          //custom page code end here

          gio("send");
        }
      }
    });
    Promise.all([
      this.props.loadAccount2state(),
      this.props.getStructuralConfig(),
      this.props.getAccountList(),
      this.props.getTraderMenu("web")
    ]).then(res => {
      if (
        this.props.account &&
        this.props.structConfig &&
        this.props.accountList.liveAccountList.length > 0
      ) {
        if (
          this.props.accountList.liveAccountList.some(
            e => e.account == this.props.account.currAccount.account
          )
        ) {
          const struct = this.props.structConfig[
            this.props.account.currAccount.vendor
          ];
          if (struct) {
            let currAccount = this.props.accountList.liveAccountList.find(
              el => {
                return el.account === this.props.account.currAccount.account;
              }
            );
            this.props.auth(currAccount, struct);
          }
        }
      }
      // 根据当前用户，判断trader左边菜单显示;
      if (this.props.traderMenus) {
        this.setState({
          customMenuList: this.props.traderMenus
        });

        if (
          this.props.account &&
          this.props.structConfig &&
          this.props.accountList.accountInfo
        ) {
          // 当前配置
          const currentConfig = this.props.structConfig[
            this.props.account.currAccount.vendor
          ];
          // 当前account
          const currAccount = this.props.account.currAccount;
          // traderAccountInfo
          const traderAccounts =
            this.props.accountList.accountInfo.tradeAccounts || [];
          // 是否有绑定父公司
          const isFatherCompany = traderAccounts.some(
            item => item.customAccountType === "Corporate" && item.isParent
          );
          // 获取被资管账户
          let assetsChild = [];
          traderAccounts.forEach(item => {
            if (item.customAccountType === "Asset") {
              assetsChild = [...assetsChild, ...item.assetAccounts.split(",")];
            }
          });
          //当仅绑定了子账户，登录子账户时，左侧菜单栏按照SC后台配置勾选的显示
          //当资管账户登录被资管的账户时
          const isShowScMenus =
            (currAccount.customAccountType === "Corporate" &&
              currAccount.isParent === false &&
              !isFatherCompany) ||
            assetsChild.includes(currAccount.account);
          if (isShowScMenus) {
            //corporateAccount assetAccount
            //subaccountRights
            // 配置信息
            let configInfo = null;
            if (currAccount.customAccountType === "Corporate") {
              configInfo = currentConfig.corporateAccount;
            } else if (currAccount.customAccountType === "Asset") {
              configInfo = currentConfig.assetAccount;
            }
            // sc配置的菜单
            const subaccountRights = configInfo
              ? configInfo.subaccountRights
              : [];
            // 筛选菜单 此处 若有子菜单，则自动加上父级菜单
            const scMenu = [];
            this.props.traderMenus.forEach(item => {
              if (subaccountRights.includes(item.key)) {
                if (item.parent !== "0") {
                  const parentItem = this.props.traderMenus.find(
                    me => me.key === item.parent
                  );
                  parentItem && scMenu.push(parentItem);
                }
                scMenu.push(item);
              }
            });

            this.setState({
              customMenuList: scMenu
            });
          }
        }
      }
    });
    this.props.getProxySetting();
    this.props.getModules().then(res => {
      //判断设备 跳转移动端:当前租户有mobile权限&&当前设备为移动端=>直接访问移动端
      if (
        res.result &&
        navigator.userAgent.match(
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
        )
      ) {
        //  直播直接跳转移动端直播
        if (this.props.location.pathname.indexOf("/live/") !== -1) {
          location.replace(
            this.props.location.pathname.replace("training/", "mobile/#/")
          );
        } else {
          location.replace("/mobile");
        }
      }
      return Promise.resolve(res);
    });
    this.props.getNationData();
    this.props.getFaData();
    this.state = {
      showNotice: false,
      isShowNotice: true,
      title: "",
      content: "",
      notices: [],
      show: false,
      customMenuList: []
    };

    // 获取sc config
    this.props.configAccess();
    this.props.getAccountTypeConfig();
  }
  componentDidMount() {
    this.props.getServerNotice();
    Promise.all([
      this.props.getUnreadNotices("WEB"),
      this.props.getUnreadNotices("WEB_ALERT")
    ]).then(rs => {
      if (rs[0].result && rs[1].result) {
        if (this.props.location.pathname.indexOf("noticeList") !== -1) return;
        this.setState({
          notices: this.state.notices.concat(rs[0].data).concat(rs[1].data)
        });
        if (
          !!this.state.notices.length &&
          sessionStorage.getItem("showNotice") != "no"
        ) {
          this.setState({
            show: true
          });
        }
        if (this.state.notices.length > 1) {
          this.setState({
            title: "",
            content: `${i18n["notice.you"]}<a href="/personal/noticeList">${
              this.state.notices.length
            }</a>${i18n["notice.unRead"]}`
          });
        } else if (this.state.notices.length === 1) {
          this.setState({
            title: this.state.notices[0].title,
            content: this.state.notices[0].content
          });
        }
      }
    });
  }
  onAuth = account => {
    //这个方法和overview.jsx中onAuth方法一致，如有修改请同步
    const struct = this.props.structConfig[account.vendor];
    this.props
      .auth(account, struct)
      .then(res => {
        Message.success(i18n["overview.account.switchaccount.success"]);
        setTimeout(() => {
          if (account.accountType === "Live") {
            //真实账户跳转交易报表页，模拟账户跳转修改密码页
            const setting = struct.basicSetting;
            if (
              setting.allowViewHistoryOrder ||
              setting.allowViewOrder ||
              setting.allowViewPosition
            )
              window.location.reload();
          } else {
            window.location.href = "/account/modifypwd";
          }
        }, 1000);
      })
      .catch(err => {
        console.error("login account", err.stack);
      });
  };
  renderHeaderSelect = () => {
    const { liveAccountList, demoAccountList } = this.props.accountList;
    const currAccountId = this.props.account.currAccount.account;
    const _list = [...liveAccountList, ...demoAccountList].map(e => {
      const isLive = e.accountType == "Live";
      const isCurr = e.account == currAccountId;
      const renderHtml = (
        <span className="account-select-label">
          <i className="iconfont icon-dangqianzhanghu01" />
          <span>{e.account}</span>
        </span>
      );
      return (
        <Option key={e.account} dataItem={e} renderHtml={renderHtml} title=" ">
          <span
            className={
              isLive ? "account-type account-type-live" : "account-type"
            }
          >
            {isLive ? i18n["account.real.symbol"] : i18n["account.mock.symbol"]}
          </span>
          <span className={isCurr ? "account-curr" : ""}>{e.account}</span>
          <span className="right account-vendor">{e.vendor}</span>
        </Option>
      );
    });
    return (
      <Select
        value={currAccountId}
        dropdownMatchSelectWidth={false}
        onSelect={(v, o) => {
          this.onAuth(o.props.dataItem);
        }}
        dropdownClassName="header-select-menu"
        optionLabelProp="renderHtml"
        getPopupContainer={() => document.getElementById("header-select")}
      >
        {_list}
      </Select>
    );
  };
  //  关闭停服等通知
  closeNotices = () => {
    this.setState({
      isShowNotice: false
    });
  };
  closeNotice = () => {
    this.setState({
      show: false
    });
    sessionStorage.setItem("showNotice", "no");
  };
  // 根据url渲染内容
  renderContent = item => {
    let content = null;
    const { children } = this.props;
    if (item.type === "SYSTEM") {
      content = children;
    } else if (item.type === "CUSTOM") {
      // source  内容来源: SYSTEM、LINK、CONTENT
      if (item.source === "LINK") {
        content = (
          <iframe
            src={item.value}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        );
      } else if (item.source === "CONTENT") {
        content = <div dangerouslySetInnerHTML={{ __html: item.value }} />;
      }
    } else {
      content = children;
    }
    return content;
  };
  renderChildren = () => {
    const {
      location: { pathname },
      children
    } = this.props;
    const menusList = ls.getItem("MENUS");
    let content = children;
    menusList &&
      menusList.length &&
      menusList.forEach(item => {
        if (item.url === pathname && !item.children.length) {
          content = this.renderContent(item);
        } else {
          if (item.children && item.children.length) {
            item.children.forEach(sub => {
              if (sub.url === pathname) {
                content = this.renderContent(sub);
              }
            });
          }
        }
      });
    return content;
  };
  render() {
    const { account } = this.props;
    const { customMenuList } = this.state;
    let top =
      this.state.isShowNotice && this.props.serverNotice
        ? { top: "38px" }
        : null;
    return (
      <div className="app-page-wrap">
        {/* 停服等通知 */}
        {this.state.isShowNotice && (
          <div className="stop-server-notice">
            <StopServerNotice
              close={this.closeNotices}
              notice={this.props.serverNotice}
            />
          </div>
        )}
        <div
          className="app-page"
          style={
            this.state.isShowNotice && this.props.serverNotice
              ? { paddingTop: "38px" }
              : null
          }
        >
          {this.props.loading ? <Loading /> : null}
          <div className="app-header" style={top}>
            <span>{this.props.headerTitle}</span>
            <div className="right header-select" id="header-select">
              {!!account && (
                <span
                  className="task"
                  onClick={() => {
                    location.href = "/fund/task";
                  }}
                >
                  <i className="iconfont icon-task" />
                </span>
              )}
              <span className="notice">
                <Badge
                  count={this.state.notices.length}
                  onClick={() => {
                    location.href = "/personal/noticeList";
                  }}
                >
                  <i className="iconfont icon-Messageprompt" />
                </Badge>
              </span>
              {!!account ? this.renderHeaderSelect() : null}
            </div>
          </div>
          <Sidebar top={top} {...this.props} customMenuList={customMenuList} />
          <div className="app-wrapper">
            <div className="page-container">{this.renderChildren()}</div>
          </div>
          <div
            className="app-notice"
            style={{ display: this.state.show ? "block" : "none" }}
          >
            <div className="header">
              {i18n["notice.info"]}
              <i className="iconfont icon-close01" onClick={this.closeNotice} />
            </div>
            <div
              className="app-notice"
              style={{
                display: !!this.state.notices.length ? "block" : "none"
              }}
            >
              <div className="header">
                {i18n["notice.info"]}
                <i
                  className="iconfont icon-close01"
                  onClick={this.closeNotice}
                />
              </div>
              <div className="content">
                <div>{this.state.title}</div>
                <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
              </div>
              <div className="footer">
                <Button
                  className="tw-btn-primary"
                  onClick={() => {
                    location.href = "/personal/noticeList";
                  }}
                >
                  {i18n["notice.detail"]}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(
  ({ common, app }) => {
    return {
      loading: common.loading,
      modules: common.modules,
      brandInfo: common.brandInfo,
      structConfig: app.structConfig,
      account: app.account,
      accountList: app.accountList,
      headerTitle: app.headerTitle,
      unReadNotices: app.unReadNotices,
      serverNotice: app.serverNotice,
      proxySetting: app.proxySetting,
      cstomMenu: app.cstomMenu,
      traderMenus: app.traderMenus,
      configAcessResult: common.configAcessResult,
      validateSettingData: common.validateSettingData,
      accountTypeConfig: common.accountTypeConfig
    };
  },
  {
    ...commonActions,
    ...actions
  }
)(App);
