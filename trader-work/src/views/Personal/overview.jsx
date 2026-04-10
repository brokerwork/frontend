import { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import i18n from "@/utils/i18n";
import { getType } from "@/utils/language";
import { FormattedMessage, injectIntl } from "react-intl";
import * as actions from "@/actions/Personal/overview";
import * as appActions from "@/actions/App/app";
import { getDemoAccountCheck } from "@/actions/Common/common";

import { setHeaderTitle, auth, getAccountList } from "@/actions/App/app";
import { ls, LAST_USER_LOGIN_TIME, USER_INFO } from "@/utils/storage";
import moment from "moment";
import CtidModal from "../Account/ctidModal.jsx";
import {
  Tooltip,
  Table,
  Modal,
  Input,
  Row,
  Col,
  Radio,
  Icon,
  message,
  Select
} from "antd";
const RadioGroup = Radio.Group;
import utils from "utils/common";
import Button from "@/components/Button";
import Message from "@/components/Message";
import "./overview.less";
import ClipboardJS from "clipboard";
import QRCode from "qrcode";
import _ from "lodash";

let clipboard = new ClipboardJS(`.copy`);
clipboard.on("success", function(e) {
  // console.info('Action:', e.action);
  // console.info('Text:', e.text);
  // console.info('Trigger:', e.trigger);

  // e.clearSelection();
  message.success(i18n["spread.hasCopy"]);
});
class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeVisible: false,
      openaccountVisible: false,
      defaultVisible: false,
      defaultAccount: "",
      visible: false,
      isSet: true, //true设置默认，false取消默认
      account: {},
      password: "",
      accountTypeList: null,
      platform: "",
      accountType: "",
      hasPassTestData: {},
      showQRCode: false,
      type: "",
      accountLists: [],
      type: "",
      enableDefault: "1",
      currentAccount: "",
      modalAccountType: false,
      customAccountType: "",
      isFirst: false,
    };
  }
  componentDidMount() {
    this.props.setHeaderTitle(i18n["menu.personal.overview"]);
    this.props.getDemoAccountCheck();
    this.props.getPointsFields();

  }
  lock = false;
  componentWillReceiveProps(nextProps) {
    this.props.setHeaderTitle(i18n["menu.personal.overview"]);
    // 如果缓存中无登录账户，就自动登录默认账户
    const { liveAccountList } = nextProps.accountList;
    if (
      liveAccountList.length > 0 &&
      !nextProps.account
    ) {
      liveAccountList.forEach(e => {
        if (e.isDefault && nextProps.structConfig) {
          nextProps.auth(e, nextProps.structConfig[e.vendor]);
        }
      });
    }
    //
    if (liveAccountList && liveAccountList.length && !this.lock) {
      this.setState({
        isFirst: nextProps.accountList.accountInfo.firstAccountLogin,
        enableDefault: nextProps.accountList.liveAccountList.some(
          el => el.isDefault
        )
          ? "1"
          : "0",
        currentAccount:
          (nextProps.accountList.liveAccountList.find(el => el.isDefault) &&
            nextProps.accountList.liveAccountList.find(el => el.isDefault)
              .account) ||
          nextProps.accountList.liveAccountList[0].account
      });
      this.resetAccountLists(liveAccountList);
      // this.setState({
      //   accountLists: this.resetAccountLists(liveAccountList)
      // });
      this.lock = true;
    }
  }
  setAccount = () => {
    this.setState({
      defaultVisible: true,
      traderPwd: ""
    });
  };
  renderLastLoginTime = () => {
    let lastLoginTime = "";
    let timestamp = ls.getItem(LAST_USER_LOGIN_TIME);
    if (timestamp) {
      lastLoginTime = moment(parseInt(timestamp)).format("YYYY-MM-DD HH:mm:ss");
    }
    return lastLoginTime;
  };
  onAuth = account => {
    //这个方法和app.jsx中onAuth方法一致，如有修改请同步
    const struct = this.props.structConfig[account.vendor];
    this.props
      .auth(account, struct)
      .then(res => {
        Message["success"](i18n["overview.account.switchaccount.success"]);
        // setTimeout(() => {
        //   if (account.accountType === "Live") {
        //     //真实账户跳转交易报表页，模拟账户跳转修改密码页
        //     const setting = struct.basicSetting;
        //     if (
        //       setting.allowViewHistoryOrder ||
        //       setting.allowViewOrder ||
        //       setting.allowViewPosition
        //     )
        //       window.location.href = "/account/transactionReports";
        //   } else {
        //     window.location.href = "/account/modifyPwd";
        //   }
        // }, 1000);
        setTimeout(() => {
          if (account.accountType === "Live") {
            //真实账户跳转交易报表页，模拟账户跳转修改密码页
            const setting = struct.basicSetting;
            if (
              setting.allowViewHistoryOrder ||
              setting.allowViewOrder ||
              setting.allowViewPosition
            ) {
              let menus = ls.getItem("MENUS");
              let accountMenu = menus.find(
                el => el.key === "menu.accountmgmt.name"
              );
              let menu =
                accountMenu &&
                accountMenu.children.find(
                  el => el.url === "/account/transactionReports"
                );
              if (menu) {
                window.location.href = menu.url;
              } else {
                window.location.reload();
              }
            }
          } else {
            // 模拟账户不跳转，不允许修改密码
            // window.location.href = "/account/modifyPwd";
          }
        }, 1000);
      })
      .catch(err => {
        console.error("login account", err.stack);
      });
  };
  setDefault = () => {
    const password = this.state.traderPwd;
    const success = () => {
      this.props.getAccountList().then(rs => {
        this.resetAccountLists(this.props.accountList.liveAccountList);
      });

      this.setState({ defaultVisible: false });
      Message["success"](i18n["overview.default.success"]);
    };
    if (this.state.enableDefault === "1") {
      const params = {
        ...this.props.accountList.liveAccountList.find(
          el => el.account === this.state.currentAccount
        ),
        password
      };
      this.props.setDefaultAccouont(params).then(res => {
        if (res.result) {
          success();
          // const {liveAccountList} = this.props.accountList
          // liveAccountList.map(e=>{
          // 	if(e.account==rowData.account){
          // 		e.isDefault = true
          // 	}else{
          // 		e.isDefault = false
          // 	}
          // 	return e
          // })
        }
      });
    } else if (this.state.enableDefault === "0") {
      const params = { account: this.state.currentAccount };
      this.props.cancelDefaultAccouont(params).then(res => {
        if (res.result) {
          success();
        }
      });
    }
  };
  toDeposit = rowData => {
    const struct = this.props.structConfig[rowData.vendor];
    this.props.auth(rowData, struct).then(res => {
      Message["success"](i18n["overview.account.switchaccount.success"]);
      window.location.href = "/fund/deposit";
    });
  };
  onActive = () => {
    const { account, serverId, vendor } = this.state.account;
    const { password } = this.state;
    if (!password) {
      Message.warning(
        i18n["overview.account.active.confirm.password.required"]
      );
      return;
    }
    this.props
      .accountActive({ password, account, serverId, vendor })
      .then(res => {
        if (res.result) {
          Message["success"](i18n["overview.account.active.success"]);
          this.setState({ activeVisible: false });
          const { liveAccountList } = this.props.accountList;
          liveAccountList.map(e => {
            if (e.account == account) {
              e.isActive = true;
            }
            return e;
          });
          this.resetAccountLists(liveAccountList);
        } //else { Message.error(i18n['overview.account.active.failed']); }
      });
  };
  showOpenaccount = () => {
    const { isPassTest } = this.props;
    isPassTest().then(res => {
      if (res && res.result) {
        this.setState({
          hasPassTestData: res.data
        });
      }
    });
    this.props.getPlatformList().then(res => {
      if (res.result && res.data.length > 0) {
        const platformList = res.data;
        this.renderTypeList(platformList[0].vendor, platformList);
        this.setState({ openaccountVisible: true });
      }
    });
  };
  onOpenaccount = customAccountType => {
    const { platform, accountType, hasPassTestData } = this.state;
    const {
      isPassTest,
      history,
      structConfig,
      accountList,
      platformList,
      accountDemoCheck
    } = this.props;
    if (accountType == "bind") {
      if (!hasPassTestData.hasTested || hasPassTestData.result == "refuse") {
        history.push(`/account/open/acttest/account/open/bind/${platform}`);
      } else {
        history.push(`/account/open/bind/${platform}`);
      }
    } else if (accountType == "demo") {
      if (platform === "CTRADER") {
        this.setState({
          visible: true,
          type: "mock"
        });
      } else {
        history.push(`/account/open/mock/${platform}`);
      }
    } else if (accountType == "live") {
      // 判断前置条件如果为无条件则和以前流程一样，如果是需开设模拟账户，则判断是否有模拟账户，如果没有则不展示开户按钮
      const platItem = platformList.find(item => item.vendor === platform);
      if (
        platItem.featureStatus.AllowBeforeDemo == "Enabled" &&
        !accountDemoCheck[platform]
      ) {
        Message["warning"](i18n["openaccount.realeAccount.before.tips"]);
        return;
      }
      if (!hasPassTestData.hasTested || hasPassTestData.result == "refuse") {
        history.push(
          `/account/open/acttest/account/open/real/${platform}${
            customAccountType ? `?accountType=${customAccountType}` : ""
          }`
        );
      } else {
        if (platform === "CTRADER") {
          this.setState({
            visible: true,
            type: "real"
          });
        } else {
          history.push(
            `/account/open/real/${platform}?accountType=${customAccountType}`
          );
        }
      }
    } else if (accountType == "same") {
      let accountslimit =
        structConfig[platform].basicSetting.maxCountSameAcount;
      let list = accountList.liveAccountList.filter(el => {
        return el.vendor == platform;
      });
      let msg = this.props.intl.formatMessage(
        { id: "account.max.sameAccount" },
        { num: accountslimit }
      );
      if (list.length >= accountslimit + 1) {
        Message["error"](msg);
        return;
      }
      if (!hasPassTestData.hasTested || hasPassTestData.result == "refuse") {
        history.push(
          `/account/open/acttest/account/open/same/${platform}${
            customAccountType ? `?accountType=${customAccountType}` : ""
          }`
        );
      } else {
        if (platform === "CTRADER") {
          this.setState({
            visible: true,
            type: "same"
          });
        } else {
          history.push(
            `/account/open/same/${platform}${
              customAccountType ? `?accountType=${customAccountType}` : ""
            }`
          );
        }
      }
    }
  };
  // 重置accounts 列表
  configAccountLists = accountList => {
    let resetAccount = {
      // Individual: [],
      // Corporate: [],
      // Asset: []
    };
    accountList &&
      accountList.length &&
      accountList.forEach(account => {
        if (!resetAccount[account.customAccountType]) {
          resetAccount[account.customAccountType] = [];
        }
        if (account.customAccountType === "Asset") {
          if (account.assetAccounts) {
            account.assetAccounts = account.assetAccounts.split(",");
          }
        }

        if (account.customAccountType === "Corporate" && account.isParent) {
          const CorporateParent = account;
          if (!CorporateParent.children) {
            CorporateParent.children = [];
          }
          CorporateParent.children = resetAccount["Corporate"];
          resetAccount["Corporate"] = CorporateParent;
        } else {
          if (!_.isArray(resetAccount[account.customAccountType])) {
            resetAccount[account.customAccountType].children.push(account);
          } else {
            resetAccount[account.customAccountType].push(account);
          }
        }
      });
    let resetList = [];
    Object.keys(resetAccount).forEach(key => {
      if (key === "Asset") {
        resetAccount[key].forEach(acc => {
          const assetChild = _.remove(resetAccount["Individual"], function(n) {
            return acc.assetAccounts.includes(n.account);
          });
          acc.children = assetChild;
        });
      }
      if (!_.isArray(resetAccount[key])) {
        resetList = [...resetList, resetAccount[key]];
      } else {
        resetList = [...resetList, ...resetAccount[key]];
      }
    });
    return resetList;
  };
  // 第二版配置accountList
  resetAccountLists = async list => {
    const accountList = _.cloneDeep(list);
    const { getAssetsChildList, getCompanyChildList } = this.props;
    // 账户类型 Asset,Individual,Corporate
    if (accountList && accountList.length) {
      for (let [index, account] of accountList.entries()) {
        if (account.customAccountType === "Asset") {
          if (account.assetAccounts && account.assetAccounts.length) {
            // 获取被资管账户列表
            await getAssetsChildList({
              accounts:
                account.assetAccounts && account.assetAccounts.split(","),
              vendor: account.vendor,
              serverId: account.serverId
            }).then(res => {
              if (res.result) {
                account.children = res.data;
              }
            });
          }
        }
        if (account.customAccountType === "Corporate" && account.isParent) {
          // 获取公司子账户
          await getCompanyChildList({
            vendor: account.vendor,
            serverId: account.serverId,
            accounts: account.account
          }).then(res => {
            if (res.result) {
              account.children = res.data;
            }
          });
        }
      }
      this.setState({
        accountLists: accountList
      });
    }
  };
  configTableColumns = () => {
    let commonColumns = [
      {
        title: i18n["overview.account.table.column.title.platform"],
        dataIndex: "platform",
        key: "platform",
        width: 100,
        render: (v, r) => {
          return (
            <span>
              {v || r["serverName"]}
              <span
                className="account-default-flag"
                style={!r.isDefault ? { display: "none" } : null}
                style={{
                  display: r.isDefault ? "inline-block" : "none"
                }}
              >
                {i18n["userinfo.bank.defaultsymbol"]}
              </span>
            </span>
          );
        }
      },
      {
        title: i18n["overview.account.table.column.title.accountname"],
        dataIndex: "accountName",
        key: "accountName",
        width: 150
      },
      {
        title: i18n["overview.account.table.column.title.account"],
        dataIndex: "account",
        key: "account",
        width: 100
      },
      {
        title: i18n["overview.account.table.column.title.currency"],
        dataIndex: "depositCurrency",
        key: "depositCurrency",
        width: 100
      },
      {
        title: i18n["overview.account.table.column.title.balance"],
        dataIndex: "balance",
        key: "balance",
        width: 100,
        render: v => {
          return typeof v !== "undefined" ? v.toFixed(2) : null;
        }
      },
      {
        title: i18n["overview.account.table.column.title.equity"],
        dataIndex: "equity",
        key: "equity",
        width: 100,
        render: v => {
          return typeof v !== "undefined" ? v.toFixed(2) : null;
        }
      },
      {
        title: i18n["overview.account.table.column.title.credit"],
        dataIndex: "credit",
        key: "credit",
        width: 100,
        render: v => {
          return typeof v !== "undefined" ? v.toFixed(2) : null;
        }
      },
      {
        title: i18n["overview.account.table.column.title.marginFree"],
        dataIndex: "marginFree",
        key: "marginFree",
        width: 100,
        render: v => {
          return typeof v !== "undefined" ? v.toFixed(2) : null;
        }
      },
      {
        title: "",
        key: "login",
        width: 170,
        fixed: "right",
        render: (value, rowData, rowIndex, self) => {
          if (!rowData.vendor) return;
          const isCurr =
            this.props.account &&
            rowData.account == this.props.account.currAccount.account;
          const isDeposit =
            this.props.structConfig &&
            this.props.structConfig[rowData.vendor] &&
            _.get(
              this.props.structConfig[rowData.vendor],
              "basicSetting.enableOnlineDeposit",
              false
            );
          if (!rowData.isActive) {
            return (
              <div className="right" style={{ lineHeight: "32px" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({
                      activeVisible: true,
                      account: rowData,
                      password: ""
                    });
                  }}
                  style={{ background: "#ff0000" }}
                >
                  {i18n["overview.account.active"]}
                </Button>
              </div>
            );
          } else {
            return (
              <div className="right" style={{ lineHeight: "32px" }}>
                <span
                  className="account-optbtn"
                  onClick={() => this.toDeposit(rowData)}
                  style={isDeposit ? null : { display: "none" }}
                >
                  {i18n["overview.gotodeposit"]}
                </span>
                <Button
                  type="primary"
                  onClick={() => this.onAuth(rowData)}
                  disabled={isCurr}
                >
                  {isCurr
                    ? i18n["overview.account.logined"]
                    : i18n["overview.account.login"]}
                </Button>
              </div>
            );
          }
        }
      }
    ];
    // 因为没有获取到vendor 只有从账户列表中获取
    let liveAccounts = this.props.accountList.liveAccountList;
    if (liveAccounts.some(item => /^CUSTOM(.*?)$/.test(item.vendor))) {
      commonColumns = [
        {
          title: i18n["overview.account.table.column.title.customAccountType"],
          dataIndex: "customAccountType",
          key: "customAccountType",
          width: 200,
          render: (v, r) => {
            return v
              ? r.customAccountType === "Corporate"
                ? r.isParent
                  ? i18n[
                      `overview.account.table.column.title.customAccountType.${v}.father`
                    ]
                  : r.isParent === undefined
                  ? i18n[
                      `overview.account.table.column.title.customAccountType.${v}`
                    ]
                  : i18n[
                      `overview.account.table.column.title.customAccountType.${v}.child`
                    ]
                : i18n[
                    `overview.account.table.column.title.customAccountType.${v}`
                  ]
              : "--";
          }
        },
        ...commonColumns
      ];
    }
    // 如果配置
    const accountTypeInfos = _.get(
      this.props.accountTypeConfig,
      "accountTypeInfos",
      []
    );

    if (accountTypeInfos.length > 1) {
      const columnsItem = {
        title: i18n["overview.account.table.column.title.customAccountType"],
        dataIndex: "customAccountType",
        key: "customAccountType",
        width: 200,
        render: (v, r) => {
          // 在配置找到相应账户类型 如果没有则显示默认的账户类型 个人账户 后来emilee让我改为 空
          const accountItem = accountTypeInfos.find(
            acc => acc.customerAccountType === v
          );
          if (accountItem) {
            const lang = getType();
            const accountTypeName = _.get(accountItem, "accountTypeName", {});
            return accountTypeName[lang];
          } else {
            return "--";
          }
        }
      };
      commonColumns.splice(1, 0, columnsItem);
    }
    return commonColumns;
  };
  renderLiveAccounts = () => {
    let liveAccounts = this.props.accountList.liveAccountList;
    let { balance, equity, credit, marginFree } =
      this.props.accountList.accountInfo || {};
    let totalRow = {
      platform: i18n["tradereport.total"],
      accountName: "",
      account: "",
      depositCurrency: "",
      balance,
      equity,
      credit,
      marginFree
    };
    if (this.props.structConfig) {
      // 服务器不启用不显示当前账户
      liveAccounts = liveAccounts.filter(el => {
        return !!this.props.structConfig[el.vendor];
      });
    }

    liveAccounts =
      liveAccounts.length > 1 ? liveAccounts.concat(totalRow) : liveAccounts;
    // const lists = this.configAccountLists(liveAccounts);
    const { accountLists } = this.state;
    const columns = this.configTableColumns();
    return (
      <div className="live-accounts">
        <div className="accounts-header">
          <span className="header-title">
            {i18n["overview.realaccount.title"]}
          </span>
          <span className="set-account" onClick={this.setAccount}>
            {i18n["overview.default.setTitle"]}
          </span>
          <span className="header-hints right">
            {i18n["overview.realaccount.blancetips"]}
          </span>
        </div>
        {accountLists.length && (
          <Table
            ref={(ref)=>{
              this.trTop = document.querySelectorAll('tr')[1].getBoundingClientRect().top-5
            }}
            columns={columns}
            locale={{
              emptyText: (
                <div className="account-empty-text">
                  {i18n["overview.noaccounts.prefix"]}
                  <Link to="/account/open">
                    {i18n["menu.accountmgmt.openaccount"]}
                  </Link>
                </div>
              )
            }}
            dataSource={accountLists}
            scroll={{ x: true }}
            pagination={false}
            defaultExpandAllRows
          />
        )}
      </div>
    );
  };
  renderDemoAccounts = () => {
    let demoAccounts = this.props.accountList.demoAccountList;
    if (demoAccounts.length == 0) {
      return null;
    }
    return (
      <div className="demo-accounts">
        <div className="accounts-header">
          <span className="header-title">
            {i18n["overview.mockaccount.title"]}
          </span>
          <span className="header-hints pull-right" />
        </div>
        <Table
          columns={[
            {
              title: i18n["overview.account.table.column.title.platform"],
              dataIndex: "platform",
              key: "platformName",
              width: "20%"
            },
            {
              title: i18n["overview.account.table.column.title.accountname"],
              dataIndex: "accountName",
              key: "accountName",
              width: "15%"
            },
            {
              title: i18n["overview.account.table.column.title.account"],
              dataIndex: "account",
              key: "account",
              width: "20%"
            },
            {
              title: "",
              key: "login",
              width: "20%",
              render: (value, rowData) => {
                const isCurr =
                  this.props.account &&
                  rowData.account == this.props.account.currAccount.account;
                return (
                  <Button
                    disabled={isCurr}
                    type="solid"
                    onClick={() => {
                      this.onAuth(rowData);
                    }}
                  >
                    {isCurr
                      ? i18n["overview.account.logined"]
                      : i18n["overview.account.login"]}
                  </Button>
                );
              }
            }
          ]}
          dataSource={demoAccounts}
          pagination={false}
        />
      </div>
    );
  };
  renderTypeList = (platform, platformList) => {
    const accountTypeList = [];
    let accountType = "";
    if (platform) {
      // const {platformList} = this.props
      platformList.forEach(e => {
        if (e.vendor == platform) {
          if (e.featureStatus.ApplyAccountWithSavedInfo == "Enabled") {
            accountTypeList.push(
              <Radio value="same">{i18n["openaccount.sameaccount"]}</Radio>
            );
            if (!accountType) accountType = "same";
          } else if (e.featureStatus.LiveAccount == "Enabled") {
            accountTypeList.push(
              <Radio value="live">{i18n["openaccount.liveaccount"]}</Radio>
            );
            if (!accountType) {
              accountType = "live";
            }
          }
          if (e.featureStatus.BindAccount == "Enabled") {
            accountTypeList.push(
              <Radio value="bind">{i18n["openaccount.bindaccount"]}</Radio>
            );
            if (!accountType) accountType = "bind";
          }
          if (e.featureStatus.DemoAccount == "Enabled") {
            accountTypeList.push(
              <Radio value="demo">{i18n["openaccount.demoaccount"]}</Radio>
            );
            if (!accountType) accountType = "demo";
          }
        }
      });
    }
    this.setState({ platform, accountTypeList, accountType });
  };
  gotoDetail = type => {
    if (type === "s") {
      this.props.history.push("/spread/recommendDetail");
    } else if (type === "a") {
      this.props.history.push("/spread/agencyDetail");
    }
  };
  renderIcons = (type, index) => {
    return (
      <div>
        <i
          className="copy icon-copy-outline"
          style={{ marginRight: 10 }}
          type="copy"
          data-clipboard-target={`.${type}input${index}`}
        />
        <i
          type="qrcode"
          className="icon-qrcode-outline"
          onClick={this.generateQRCode.bind(this, type, index)}
        />
      </div>
    );
  };
  generateQRCode = (type, index) => {
    let url = this.refs[`${type}input${index}`].input.value;
    let canvas = document.getElementById("canvas");
    QRCode.toCanvas(canvas, url, error => {
      if (error) {
        console.error(error);
        return;
      }
      this.setState({
        showQRCode: true
      });
      // message.success('已生成二维码！')
    });
  };
  hideQRCode = () => {
    this.setState({
      showQRCode: false
    });
  };
  selectText = e => {
    const dom = e.target;
    utils.selectText(dom);
  };
  closeModal = () => {
    this.setState({
      visible: false
    });
  };
  setDefaultAccount = e => {
    this.setState({
      enableDefault: e.target.value
    });
  };
  selectAccount = value => {
    this.setState({
      currentAccount: value
    });
  };
  renderAccountRadio = accountTypeInfos => {
    const { platform } = this.state;
    const lang = getType();
    // 过滤权限
    const accountTypeList = accountTypeInfos.filter(
      item => _.get(item, `rights.${platform}`, []).length
    );
    return accountTypeList.map(item => {
      const title =
        item.accountTypeName[lang] || (lang === "zh-CN" ? "未命名" : "unknown");
      return (
        <div>
          <Radio
            key={item.customerAccountType}
            //   style={radioStyle}
            value={item.customerAccountType}
          >
            <span>{title}</span>
          </Radio>
          <p className="accountType_desc">{item.accountTypDesc[lang]}</p>
        </div>
      );
    });
  };
  handleAccountChange = e => {
    this.setState({
      customAccountType: e.target.value
    });
  };
  isModalVisible = (name, visible) => {
    this.setState({
      [name]: visible
    });
  };
  openAccountType = () => {
    const {
      accountTypeConfig: { accountTypeInfos }
    } = this.props;
    const { accountType, platform } = this.state;
    // 过滤权限
    const accountTypeList = accountTypeInfos.filter(
      item => _.get(item, `rights.${platform}`, []).length
    );
    if (
      (accountType === "live" || accountType === "same") &&
      accountTypeList &&
      accountTypeList.length > 1
    ) {
      this.isModalVisible("modalAccountType", true);
    } else if (
      (accountType === "live" || accountType === "same") &&
      accountTypeList &&
      accountTypeList.length === 1
    ) {
      this.setState(
        {
          customAccountType: accountTypeList[0].customerAccountType
        },
        () => {
          this.onOpenaccount(accountTypeList[0].customerAccountType);
        }
      );
    } else {
      this.onOpenaccount();
    }
  };
  nextStep = () => {
    const { customAccountType } = this.state;
    this.isModalVisible("modalAccountType", false);
    this.onOpenaccount(customAccountType);
  };
  render() {
    const {
      account,
      platform,
      showQRCode,
      currentAccount,
      modalAccountType,
      customAccountType
    } = this.state;
    const {
      platformList,
      pointsMap,
      proxySetting: {
        twDirectIntroducesUrlList = [],
        twAgentIntroducesUrlList = [],
        bwUserId,
        agentNum,
        straightGuestNum
      },
      accountList: { accountInfo },
      accountTypeConfig: { accountTypeInfos }
    } = this.props;
    let liveAccounts = this.props.accountList.liveAccountList;
    let isAgency = false;
    if (bwUserId) {
      // 身份：代理
      isAgency = true;
    } else {
      // 身份：直客
    }
    const pointsInfo = accountInfo;
    const points = [];
    for (let i in pointsInfo) {
      if (i.indexOf("points") !== -1 && pointsMap[i]) {
        points.push({
          key: i,
          value: pointsInfo[i] || "--",
          orderNo: pointsMap[i].orderNo
        });
      }
    }
    return (
      <div className="overview">
      {this.state.isFirst && this.trTop &&  <div className="first-login">
          <div style={{marginTop: this.trTop}}>
            <p className="tip">{i18n['webcast.hint.sweet']}</p>
            <p className="content">{i18n['overview.first.tip']}</p>
            <p>
              <a onClick={()=>{
                this.setState({
                  isFirst: false
                })
              }}>{i18n['overview.first.iknow']}</a>

            </p>
          </div>  
        </div>}
        <div className="welcome-msg" id="welcome-msg">
          <div style={{ display: "inline-block" }}>
            <h3>{i18n["overview.welcome"]}</h3>
            <h4>
              {i18n["overview.lastlogintime"] + this.renderLastLoginTime()}
              <Tooltip
                title={i18n["overview.lastlogintime.tips"]}
                placement="topLeft"
                arrowPointAtCenter="true"
                getPopupContainer={() => document.getElementById("welcome-msg")}
              >
                <i className="iconfont icon-tishi01 last-login-msg" />
              </Tooltip>
            </h4>
          </div>
          <Button
            type="primary"
            className="right"
            onClick={this.showOpenaccount}
          >
            {i18n["overview.openaccount"]}
          </Button>
        </div>
        <ul className="points">
          {points
            .sort((a, b) => a.orderNo - b.orderNo)
            .map(el => {
              return (
                <li>
                  <p>{pointsMap[el.key].label}</p>
                  {el.value}
                </li>
              );
            })}
        </ul>
        <div className="divider" />
        {(!!twDirectIntroducesUrlList.length ||
          !!twAgentIntroducesUrlList.length) && (
          <div className="spread" style={{maxHeight: this.state.isFirst?70:400}}>
            <div className="left">
              <div
                style={{ display: showQRCode ? "block" : "none" }}
                className="canvas"
                onClick={this.hideQRCode}
              >
                <canvas id="canvas" />
              </div>
              <div>
                {twDirectIntroducesUrlList.map((el, index) => {
                  return (
                    <Row>
                      <Col span={4}>{el.name}:</Col>
                      <Col span={18}>
                        <Input
                          onClick={this.selectText}
                          ref={`dinput${index}`}
                          className={`dinput${index}`}
                          readOnly
                          value={el.displayUrl}
                          addonAfter={this.renderIcons("d", index)}
                        />
                      </Col>
                      <Col span={2} />
                    </Row>
                  );
                })}
              </div>
              {isAgency && (
                <div>
                  {twAgentIntroducesUrlList.map((el, index) => {
                    return (
                      <Row>
                        <Col span={4}>{el.name}:</Col>
                        <Col span={18}>
                          <Input
                            onClick={this.selectText}
                            ref={`ainput${index}`}
                            className={`ainput${index}`}
                            readOnly
                            value={el.displayUrl}
                            addonAfter={this.renderIcons("a", index)}
                          />
                        </Col>
                        <Col span={2} />
                      </Row>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="right">
              <div>
                {i18n["spread.total.streight"]}
                <span className="num" onClick={this.gotoDetail.bind(this, "s")}>
                  {straightGuestNum}
                </span>
              </div>
              {isAgency && (
                <div>
                  {i18n["spread.total.agency"]}
                  <span
                    className="num"
                    onClick={this.gotoDetail.bind(this, "a")}
                  >
                    {agentNum}
                  </span>
                </div>
              )}
              {/* <div className="link" onClick={this.gotoDetail}>
							{i18n['twapp.monthlyreport.detail.open_detail']}
						</div> */}
            </div>
          </div>
        )}
        {this.renderLiveAccounts()}
        {this.renderDemoAccounts()}
        <div className="active-account-modal" id="active-account-modal">
          <Modal
            title={i18n["overview.account.active.confirm.title"]}
            visible={this.state.activeVisible}
            onCancel={() => this.setState({ activeVisible: false })}
            getContainer={() => document.getElementById("active-account-modal")}
            footer={
              <span>
                <Button
                  onClick={() => {
                    this.onActive();
                  }}
                  type="primary"
                >
                  {i18n["overview.account.active.confirm.ok"]}
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ activeVisible: false });
                  }}
                >
                  {i18n["general.button.cancel"]}
                </Button>
              </span>
            }
          >
            <div className="tui-form modalContent">
              <Row>
                <Col span={8} className="label-col">
                  {i18n["overview.account.active.confirm.account"]}
                </Col>
                <Col span={10}>
                  <Input value={account.account} disabled={true} />
                </Col>
              </Row>
              <Row>
                <Col span={8} className="label-col">
                  {i18n["overview.account.active.confirm.accountname"]}
                </Col>
                <Col span={10}>
                  <Input value={account.accountName} disabled={true} />
                </Col>
              </Row>
              <Row>
                <Col span={8} className="label-col">
                  <span>*&nbsp;</span>
                  {i18n["overview.account.active.confirm.password"]}
                </Col>
                <Col span={10}>
                  <Input
                    value={this.state.password}
                    onChange={e => {
                      this.setState({ password: e.target.value });
                    }}
                    type="password"
                  />
                </Col>
              </Row>
            </div>
          </Modal>
        </div>
        <div className="openaccount-modal" id="openaccount-modal">
          <Modal
            title={i18n["overview.openaccount"]}
            visible={this.state.openaccountVisible}
            onCancel={() => this.setState({ openaccountVisible: false })}
            getContainer={() => document.getElementById("openaccount-modal")}
            footer={
              <span>
                <Button
                  // onClick={() => {
                  //   this.onOpenaccount();
                  // }}
                  onClick={this.openAccountType}
                  type="primary"
                >
                  {i18n["overview.openaccount"]}
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ openaccountVisible: false });
                  }}
                >
                  {i18n["general.button.cancel"]}
                </Button>
              </span>
            }
          >
            <div className="modalContent">
              <div className="radio-label">
                {i18n["overview.openaccount.platform"]}:
              </div>
              <RadioGroup
                onChange={e =>
                  this.renderTypeList(e.target.value, this.props.platformList)
                }
                value={this.state.platform}
              >
                {platformList.map(e => {
                  return <Radio value={e.vendor}>{e.displayName}</Radio>;
                })}
              </RadioGroup>
              <div className="radio-label">
                {i18n["overview.openaccount.type"]}:
              </div>
              <RadioGroup
                onChange={e => this.setState({ accountType: e.target.value })}
                value={this.state.accountType}
              >
                {this.state.accountTypeList}
              </RadioGroup>
            </div>
          </Modal>
        </div>
        <div className="set-default-modal" id="set-default-modal">
          <Modal
            title={i18n["overview.default.setTitle"]}
            visible={this.state.defaultVisible}
            onCancel={() => this.setState({ defaultVisible: false })}
            getContainer={() => document.getElementById("set-default-modal")}
            width="400px"
            style={{ top: 0, width: "" }}
            wrapClassName="set-default-wrap"
            footer={
              <span>
                <Button
                  onClick={() => {
                    this.setDefault();
                  }}
                  type="primary"
                >
                  {i18n["general.button.sure"]}
                </Button>
                <Button
                  onClick={() => {
                    this.setState({ defaultVisible: false });
                  }}
                >
                  {i18n["general.button.cancel"]}
                </Button>
              </span>
            }
          >
            <div>
              <div>
                {i18n["overview.enable.default"]}
                <RadioGroup
                  onChange={this.setDefaultAccount}
                  value={this.state.enableDefault}
                >
                  <Radio value={"1"}>{i18n["spread.yes"]}</Radio>
                  <Radio value={"0"}>{i18n["spread.no"]}</Radio>
                </RadioGroup>
              </div>
              <div className="account-tip">
                {this.state.enableDefault === "1"
                  ? i18n["overview.set.default"]
                  : i18n["overview.ban.default"]}
              </div>
              <div className="account">
                {i18n["transfer.pleaseChooseAccount"]}
                <Select
                  onChange={this.selectAccount}
                  disabled={this.state.enableDefault === "0"}
                  style={{ width: 110 }}
                  defaultValue={currentAccount}
                >
                  {liveAccounts.map(el => {
                    return (
                      <Select.Option value={el.account}>
                        {el.account}
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>

              {this.state.enableDefault === "1" && (
                <div>
                  <FormattedMessage
                    id="overview.default.setTips"
                    values={{ account: currentAccount }}
                  />
                  {/* <p className="tips">{i18n['overview.default.setTips2']}</p>
                  <Input type="password" placeholder={i18n['overview.default.traderPwd']} 
                    className="trader-pwd" value={this.state.traderPwd}
                    onChange={e=>this.setState({traderPwd:e.target.value})}/> */}
                </div>
              )}
            </div>
          </Modal>
        </div>
        <CtidModal
          onChange={this.closeModal}
          history={this.props.history}
          type={this.state.type}
          visible={this.state.visible}
        />
        <Modal
          visible={modalAccountType}
          title={i18n["openAccountType.modal.title"]}
          footer={
            <div className="account-modal-footer">
              <Button
                onClick={this.nextStep}
                type={customAccountType ? "primary" : "default"}
                disabled={customAccountType ? false : true}
              >
                {i18n["openaccount.next"]}
              </Button>
            </div>
          }
          onCancel={this.isModalVisible.bind(this, "modalAccountType", false)}
        >
          <div className="account_modal_container">
            <Radio.Group
              onChange={this.handleAccountChange}
              value={customAccountType}
            >
              {accountTypeInfos &&
                accountTypeInfos.length &&
                this.renderAccountRadio(accountTypeInfos)}
            </Radio.Group>
          </div>
        </Modal>
      </div>
    );
  }
}
export default connect(
  ({ app, personal, common }) => {
    return {
      structConfig: app.structConfig,
      account: app.account,
      accountList: app.accountList,
      platformList: personal.platformList,
      proxySetting: app.proxySetting,
      accountDemoCheck: common.accountDemoCheck,
      accountTypeConfig: common.accountTypeConfig,
      pointsMap: personal.pointsMap
    };
  },
  {
    ...actions,
    ...appActions,
    setHeaderTitle,
    auth,
    getAccountList,
    getDemoAccountCheck
  }
)(injectIntl(Overview));
